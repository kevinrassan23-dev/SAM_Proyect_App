import { Medicamento, medicamentosService } from "@/services/supabase/medicamentos";
import { styles } from "@/styles/screens/shop/HallStyle";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type CarritoItem = { medicamento: Medicamento; cantidad: number };

function Hall() {
  const {
    telefono,
    dni,
    tieneReceta: tieneRecetaParam,
    medicamentosReceta,
    medicamentos: medicamentosCompradosParam,
    carrito: carritoParam
  } = useLocalSearchParams();

  const [showDrawer, setShowDrawer] = useState(false);
  const [showNofilterDrawer, setshowNofilterDrawer] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [sinReceta, setSinReceta] = useState<CarritoItem[]>([]);
  const [conReceta, setConReceta] = useState<CarritoItem[]>([]);
  const [search, setSearch] = useState("");
  const [medicamentosBD, setMedicamentosBD] = useState<Medicamento[]>([]);
  const [medicamentosRecetaBD, setMedicamentosRecetaBD] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medicamentosRecetaSeleccionados, setMedicamentosRecetaSeleccionados] = useState<Set<string>>(new Set());
  const [stock, setStock] = useState<Record<string, number>>({});

  // ── NUEVO: IDs de medicamentos con receta bloqueados localmente (1 hora tras compra)
  const [medicamentosBloqueados, setMedicamentosBloqueados] = useState<Set<string>>(new Set());

  const sinRecetaIds = new Set(sinReceta.map(ci => ci.medicamento.id));
  const tieneReceta = tieneRecetaParam === "true";

  const carritoData = [...conReceta, ...sinReceta];

  const [todosRecetaAnadidos, setTodosRecetaAnadidos] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (carritoParam && medicamentosBD.length > 0) {
      try {
        const datosRecibidos = JSON.parse(carritoParam as string) as CarritoItem[];
        const nombresRecetaURL = new Set(
          typeof medicamentosReceta === 'string'
            ? medicamentosReceta.split(",").map(n => n.trim().toLowerCase())
            : []
        );
        const recuperadosConReceta = datosRecibidos.filter(item =>
          nombresRecetaURL.has(item.medicamento.nombre.toLowerCase())
        );
        const recuperadosSinReceta = datosRecibidos.filter(item =>
          !recuperadosConReceta.some(r => r.medicamento.id === item.medicamento.id)
        );
        setConReceta(recuperadosConReceta);
        setSinReceta(recuperadosSinReceta);
        setMedicamentosRecetaSeleccionados(new Set(recuperadosConReceta.map(m => m.medicamento.id)));
        setStock(prev => {
          const nuevoStock = { ...prev };
          datosRecibidos.forEach(item => {
            const medOriginal = medicamentosBD.find(m => m.id === item.medicamento.id);
            if (medOriginal) {
              const stockBase = medOriginal.stock ?? 100;
              nuevoStock[item.medicamento.id] = stockBase - item.cantidad;
            }
          });
          return nuevoStock;
        });
      } catch (e) {
        console.error(`[${new Date().toLocaleTimeString()}] Error al restaurar estado visual:`, e);
      }
    }
  }, [carritoParam, medicamentosBD, medicamentosReceta]);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      setLoading(true);
      try {
        // 1. Cargar sin receta desde Supabase
        const dataSinReceta = await medicamentosService.obtenerSinReceta();
        setMedicamentosBD(dataSinReceta);

        // 2. Cargar con receta desde Firebase
        let dataConReceta: Medicamento[] = [];
        if (tieneReceta && medicamentosReceta) {
          const { recetasService } = await import('@/services/firebase/recetas');

          // ── NUEVO: Limpiamos bloqueos caducados antes de consultar
          await recetasService.limpiarBloqueosCaducados();

          dataConReceta = await recetasService.obtenerMedicamentosReceta(dni as string);

          // ── NUEVO: Leemos qué medicamentos siguen bloqueados localmente (< 1 hora)
          const bloqueados = await recetasService.obtenerMedicamentosBloqueados();
          setMedicamentosBloqueados(new Set(bloqueados));

          setMedicamentosRecetaBD(dataConReceta);
        }

        // 3. Inicialización de stock
        const stockInicial: Record<string, number> = {};
        dataSinReceta.forEach(med => { stockInicial[med.id] = med.stock ?? 100; });
        dataConReceta.forEach(med => { stockInicial[med.id] = med.stock ?? 100; });

        // 4. Restauración si volvió de FormaPago
        if (carritoParam) {
          const datosRecibidos = JSON.parse(carritoParam as string) as CarritoItem[];
          const recuperadosConReceta = datosRecibidos.filter(item =>
            dataConReceta.some(m => m.id === item.medicamento.id)
          );
          const recuperadosSinReceta = datosRecibidos.filter(item =>
            !recuperadosConReceta.some(r => r.medicamento.id === item.medicamento.id)
          );
          setConReceta(recuperadosConReceta);
          setSinReceta(recuperadosSinReceta);
          setMedicamentosRecetaSeleccionados(new Set(recuperadosConReceta.map(m => m.medicamento.id)));
          datosRecibidos.forEach(item => {
            if (stockInicial[item.medicamento.id] !== undefined) {
              stockInicial[item.medicamento.id] -= item.cantidad;
            }
          });
        }

        setStock(stockInicial);

      } catch (err: any) {
        console.error(`[${new Date().toLocaleTimeString()}] Error en Hall fetch:`, err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, [tieneReceta, medicamentosReceta, carritoParam]);

  const medicamentosPorFamilia: Record<string, Medicamento[]> = medicamentosBD.reduce(
    (acc, med) => {
      const familia = med.familia || "Otros";
      if (!acc[familia]) acc[familia] = [];
      acc[familia].push(med);
      return acc;
    },
    {} as Record<string, Medicamento[]>
  );

  const handleRemoveProducto = (id: string) => {
    const medCon = conReceta.find(m => m.medicamento.id === id);
    const medSin = sinReceta.find(m => m.medicamento.id === id);
    if (medCon) {
      setConReceta(prev => prev.filter(item => item.medicamento.id !== id));
      setMedicamentosRecetaSeleccionados(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setStock(prev => ({ ...prev, [id]: (prev[id] ?? 100) + medCon.cantidad }));
    } else if (medSin) {
      setSinReceta(prev => prev.filter(item => item.medicamento.id !== id));
      setStock(prev => ({ ...prev, [id]: (prev[id] ?? 100) + medSin.cantidad }));
    }
  };

  const handleIncrementar = (id: string) => {
    if ((stock[id] ?? 100) <= 0) return;
    setSinReceta(prev => prev.map(ci =>
      ci.medicamento.id === id && ci.cantidad < 5 ? { ...ci, cantidad: ci.cantidad + 1 } : ci
    ));
    setStock(prev => ({ ...prev, [id]: (prev[id] ?? 100) - 1 }));
  };

  const handleDecrementar = (id: string) => {
    setSinReceta(prev => prev.map(ci =>
      ci.medicamento.id === id && ci.cantidad > 1 ? { ...ci, cantidad: ci.cantidad - 1 } : ci
    ));
    setStock(prev => ({ ...prev, [id]: (prev[id] ?? 100) + 1 }));
  };

  const handleAgregarConReceta = (med: Medicamento) => {
    if (medicamentosBloqueados.has(med.id)) return;
    if (!medicamentosRecetaSeleccionados.has(med.id)) {
      const nuevosSeleccionados = new Set([...medicamentosRecetaSeleccionados, med.id]);
      setConReceta(prev => [...prev, { medicamento: med, cantidad: 1 }]);
      setMedicamentosRecetaSeleccionados(nuevosSeleccionados);
      setStock(prev => ({ ...prev, [med.id]: (prev[med.id] ?? 100) - 1 }));

      // ── Si todos los medicamentos con receta están ya seleccionados, mostramos mensaje
      const todosAnadidos = medicamentosRecetaBD.every(m => nuevosSeleccionados.has(m.id));
      setTodosRecetaAnadidos(todosAnadidos);
    }
  };

  const handleAgregarSinReceta = (med: Medicamento) => {
    setSinReceta(prev => [...prev, { medicamento: med, cantidad: 1 }]);
    setStock(prev => ({ ...prev, [med.id]: (prev[med.id] ?? 100) - 1 }));
  };

  const toggleCategory = (categoria: string) => {
    setExpandedCategories(prev => ({ ...prev, [categoria]: !prev[categoria] }));
  };

  const comprar = async () => {
    if (carrito.length === 0) return;
    router.push({
      pathname: "/screens/shop/FormaPago",
      params: {
        total: totalGeneral.toFixed(2),
        carrito: JSON.stringify(carrito),
        telefono: telefono
      },
    });
  };

  const cancelar = () => {
    Alert.alert(
      t("Hall.DESEASSALIR"),
      t("Hall.PERDERPROGRESO"),
      [
        { text: t("Hall.PERMANECERAQUÍ"), style: "cancel" },
        {
          text: t("Hall.SALIR"),
          onPress: () => {
            setSinReceta([]);
            setConReceta([]);
            setMedicamentosRecetaSeleccionados(new Set());
            router.replace("/screens/home/Home");
          }
        },
      ]
    );
  };

  const FamiliaTradución = (familia: string): string => {
    switch (familia.toLowerCase().trim()) {
      case "gripe y resfriado": return t("Hall.GRIPEYRESFRIADO");
      case "analgésicos": return t("Hall.ANALGÉSICOS");
      case "alérgenos": return t("Hall.ALÉRGENOS");
      case "dieta y nutrición": return t("Hall.DIETAYNUTRICIÓN");
      case "cuidado del cabello y piel": return t("Hall.CUIDADODELCABELLOYPIEL");
      case "salud bucal": return t("Hall.SALUDBUSCAL");
      case "primeros auxilios": return t("Hall.PRIMEROSAUXILIOS");
      default: return familia;
    }
  };

  const MarcaGenericaTradución = (marca: string): string => {
    switch (marca.toLowerCase().trim()) {
      case "genérico": return t("Hall.GENERICO");
      default: return marca;
    }
  };

  const totalGeneral = [...conReceta, ...sinReceta].reduce((total, ci) => total + (ci.medicamento.precio * ci.cantidad), 0);
  const carrito = [...conReceta, ...sinReceta];


  const renderItem = ({ item }: { item: CarritoItem }) => {
    const esSinReceta = sinReceta.some(ci => ci.medicamento.id === item.medicamento.id);
    return (
      <View style={styles.itemCard}>
        <Image source={{ uri: item.medicamento.img_medicamento?.trim() || "https://via.placeholder.com/70" }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.medicamento.nombre}</Text>
          <Text style={styles.itemText}>{MarcaGenericaTradución(item.medicamento.marca || "")}</Text>
          <Text style={styles.itemText}>{t("Hall.STOCK")}: {stock[item.medicamento.id] ?? 0}</Text>
          <Text style={styles.itemPrice}>{item.medicamento.precio.toFixed(2)} €</Text>
        </View>
        {esSinReceta && (
          <View style={{ alignItems: "center", justifyContent: "center", marginRight: 15 }}>
            <Pressable onPress={() => handleIncrementar(item.medicamento.id)} disabled={item.cantidad >= 5 || (stock[item.medicamento.id] ?? 0) <= 0}>
              <MaterialIcons name="keyboard-arrow-up" size={28} color={item.cantidad >= 5 ? "#666" : "#fff"} />
            </Pressable>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>{item.cantidad}</Text>
            <Pressable onPress={() => handleDecrementar(item.medicamento.id)} disabled={item.cantidad <= 1}>
              <MaterialIcons name="keyboard-arrow-down" size={28} color={item.cantidad <= 1 ? "#666" : "#fff"} />
            </Pressable>
          </View>
        )}
        <Pressable onPress={() => handleRemoveProducto(item.medicamento.id)}>
          <MaterialIcons name="delete" size={24} color="#E63946" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={carritoData}
        keyExtractor={(item) => item.medicamento.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            {/* SECCIÓN CON RECETA */}
            {tieneReceta && medicamentosRecetaBD.length > 0 ? (
              <View style={[styles.card, { paddingBottom: 0 }]}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{t("Hall.CONRECETA")}</Text>
                    <Text style={styles.subText}>{t("Hall.MEDICAMENTOSRECETADOS")}</Text>
                  </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                  {medicamentosRecetaBD
                    // ── Ocultamos los ya añadidos al carrito Y los bloqueados localmente
                    .filter(med => !medicamentosRecetaSeleccionados.has(med.id) && !medicamentosBloqueados.has(med.id))
                    .map((med) => (
                      <Pressable
                        key={med.id}
                        style={styles.medicamentCard}
                        onPress={() => handleAgregarConReceta(med)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.medicamentName}>{med.nombre}</Text>
                          <Text style={styles.medicamentSubtext}>
                            {MarcaGenericaTradución(med.marca || "")} • {FamiliaTradución(med.familia || "")}
                          </Text>
                        </View>
                        <Text style={styles.medicamentPrice}>{med.precio.toFixed(2)} €</Text>
                      </Pressable>
                    ))}

                  {/* ── Mensaje cuando todos los medicamentos están añadidos o bloqueados */}
                  {medicamentosRecetaBD.every(med =>
                    medicamentosRecetaSeleccionados.has(med.id) || medicamentosBloqueados.has(med.id)
                  ) && (
                      <Text style={{ color: "#4CAF50", textAlign: "center", marginVertical: 8, fontWeight: "bold" }}>
                        ✅ {t("Hall.MEDICAMENTOSAGREGADOS")}
                      </Text>
                    )}
                </View>
              </View>
            ) : (
              <Pressable style={styles.card} onPress={() => router.push("/screens/auth/IngresarCartilla")}>
                <View style={[styles.cardHeader, styles.flecha]}>
                  <View>
                    <Text style={styles.cardTitle}>{t("Hall.CONRECETA")}</Text>
                    <Text style={styles.subText}>{t("Hall.TIENESRECETA")}</Text>
                  </View>
                  <MaterialIcons name="launch" size={24} color="#fff" />
                </View>
                <Text style={styles.mediumText}>{t("Hall.NOHAYRECETA")}</Text>
              </Pressable>
            )}

            {/* SECCIÓN SIN RECETA */}
            <View style={styles.card2}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>{t("Hall.SINRECETA")}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable style={styles.filterButton} onPress={() => setshowNofilterDrawer(true)}>
                    <MaterialIcons name="add-shopping-cart" size={18} color="#ffffff" />
                    <Text style={styles.filterText}>{t("Hall.AÑADIR")}</Text>
                  </Pressable>
                  <Pressable style={styles.filterButton} onPress={() => setShowDrawer(true)}>
                    <MaterialIcons name="filter-list" size={18} color="#ffffff" />
                    <Text style={styles.filterText}>{t("Hall.FILTRAR")}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        }
        ListFooterComponent={<View style={{ paddingVertical: 20 }}>
          <Text style={styles.totalText}>
            {carrito.reduce((acc, ci) => acc + ci.cantidad, 0)} {t("Hall.ARTICULOS")}
          </Text>
          <Text style={styles.totalText}>{t("Hall.TOTAL")}: {totalGeneral.toFixed(2)} €</Text>
        </View>}
        contentContainerStyle={{ paddingBottom: 170 }}
      />

      <Modal visible={showDrawer} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowDrawer(false)}>
          <View style={styles.drawer}>
            <TextInput placeholder={t("Hall.BUSCAR")} value={search} onChangeText={setSearch} style={styles.searchInput} />
            <ScrollView>
              {Object.entries(medicamentosPorFamilia).map(([familia, meds]) => {
                const filtrados = meds.filter((m) => m.nombre.toLowerCase().includes(search.toLowerCase()));
                if (filtrados.length === 0) return null;
                return (
                  <View key={familia}>
                    <Pressable onPress={() => toggleCategory(familia)} style={styles.drawerCategoryButton}>
                      <Text style={styles.drawerCategory}>{FamiliaTradución(familia)}</Text>
                      <MaterialIcons name={expandedCategories[familia] ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#fff" />
                    </Pressable>
                    {expandedCategories[familia] && filtrados.map((med) => {
                      const stockActual = stock[med.id] ?? med.stock ?? 0;
                      const bloqueado = sinRecetaIds.has(med.id) || stockActual <= 0;
                      return (
                        <Pressable
                          key={med.id}
                          style={[styles.medicamentCard, bloqueado && { opacity: 0.4 }]}
                          onPress={() => { if (!bloqueado) { handleAgregarSinReceta(med); setShowDrawer(false); } }}
                          disabled={bloqueado}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={styles.medicamentName}>{med.nombre}</Text>
                            <Text style={styles.medicamentSubtext}>{t("Hall.STOCK")}: {stockActual} • {MarcaGenericaTradución(med.marca || "")}</Text>
                          </View>
                          <Text style={styles.medicamentPrice}>{med.precio.toFixed(2)} €</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showNofilterDrawer} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setshowNofilterDrawer(false)}>
          <View style={styles.drawer}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>{t("Hall.AÑADIRMEDICAMENTO")}</Text>
            <ScrollView>
              {medicamentosBD.filter((m) => m.nombre.toLowerCase().includes(search.toLowerCase())).map((med) => {
                const stockActual = stock[med.id] ?? med.stock ?? 0;
                const yaEnCarrito = sinRecetaIds.has(med.id);
                const bloqueado = yaEnCarrito || stockActual <= 0;
                return (
                  <Pressable
                    key={med.id}
                    style={[styles.medicamentCard, bloqueado && { opacity: 0.4 }]}
                    onPress={() => { if (bloqueado) return; handleAgregarSinReceta(med); setshowNofilterDrawer(false); setSearch(""); }}
                    disabled={bloqueado}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.medicamentName}>{med.nombre}</Text>
                      <Text style={styles.medicamentSubtext}>{t("Hall.STOCK")}: {stock[med.id] ?? 100} • {MarcaGenericaTradución(med.marca || "")}</Text>
                    </View>
                    <Text style={styles.medicamentPrice}>{med.precio.toFixed(2)} €</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* ✅ SECCIÓN DE BOTONES INFERIORES */}
      <View style={styles.bottomButtons}>
        <Pressable
          style={[styles.bottomButton, carrito.length === 0 && { opacity: 0.5 }]}
          onPress={comprar}
          disabled={carrito.length === 0}
        >
          <Text style={styles.bottomButtonText}>{t("Hall.COMPRAR")}</Text>
        </Pressable>
        <Pressable style={styles.bottomButtonVolver} onPress={cancelar}>
          <Text style={styles.bottomButtonText}>{t("Hall.CANCELAR")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Hall;