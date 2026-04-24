import { Medicamento, medicamentosService } from "@/services/supabase/medicamentos";
import { styles } from "@/styles/screens/shop/HallStyle";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
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

// --- Tipos y Definiciones ---
type CarritoItem = { medicamento: Medicamento; cantidad: number };

function Hall() {
  // --- Hooks y Parámetros ---
  const {
    telefono,
    dni,
    tieneReceta: tieneRecetaParam,
    medicamentosReceta,
    medicamentos: medicamentosCompradosParam,
    carrito: carritoParam
  } = useLocalSearchParams();

  const { t } = useTranslation();

  // --- Estados de Interfaz ---
  const [showDrawer, setShowDrawer] = useState(false);
  const [showNofilterDrawer, setshowNofilterDrawer] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estados de Negocio y Carrito ---
  const [sinReceta, setSinReceta] = useState<CarritoItem[]>([]);
  const [conReceta, setConReceta] = useState<CarritoItem[]>([]);
  const [medicamentosBD, setMedicamentosBD] = useState<Medicamento[]>([]);
  const [medicamentosRecetaBD, setMedicamentosRecetaBD] = useState<Medicamento[]>([]);
  const [medicamentosRecetaSeleccionados, setMedicamentosRecetaSeleccionados] = useState<Set<string>>(new Set());
  const [stock, setStock] = useState<Record<string, number>>({});
  const [medicamentosBloqueados, setMedicamentosBloqueados] = useState<Set<string>>(new Set());
  const [nombresBloqueadosRateLimit, setNombresBloqueadosRateLimit] = useState<Set<string>>(new Set());
  const [todosRecetaAnadidos, setTodosRecetaAnadidos] = useState(false);

  // --- Variables Computadas ---
  const sinRecetaIds = new Set(sinReceta.map(ci => ci.medicamento.id));
  const tieneReceta = tieneRecetaParam === "true";
  const carritoData = [...conReceta, ...sinReceta];
  const totalGeneral = carritoData.reduce((total, ci) => total + (ci.medicamento.precio * ci.cantidad), 0);
  const carrito = [...conReceta, ...sinReceta];

  // --- Efectos de Inicialización ---

  /**
   * Restaura el estado del carrito si existe un parámetro de carrito previo en la URL.
   */
  useEffect(() => {
    if (carritoParam && medicamentosBD.length > 0) {
      console.log(`[${new Date().toLocaleTimeString()}] Restaurando carrito desde parámetros.`);
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
        console.log(`[${new Date().toLocaleTimeString()}] Error al restaurar estado visual:`, e);
      }
    }
  }, [carritoParam, medicamentosBD, medicamentosReceta]);

  /**
   * Carga inicial de datos: Medicamentos de Supabase, Recetas de Firebase y Rate Limits.
   */
  useEffect(() => {
    const fetchMedicamentos = async () => {
      setLoading(true);
      console.log(`[${new Date().toLocaleTimeString()}] Iniciando carga de medicamentos y reglas de negocio.`);
      try {
        // 1. Obtención de medicamentos generales
        const dataSinReceta = await medicamentosService.obtenerSinReceta();
        setMedicamentosBD(dataSinReceta);

        // 2. Obtención de medicamentos con receta y gestión de bloqueos temporales
        let dataConReceta: Medicamento[] = [];
        if (tieneReceta && medicamentosReceta) {
          const { recetasService } = await import('@/services/firebase/recetas');
          await recetasService.limpiarBloqueosCaducados();
          dataConReceta = await recetasService.obtenerMedicamentosReceta(dni as string);
          
          const bloqueados = await recetasService.obtenerMedicamentosBloqueados();
          setMedicamentosBloqueados(new Set(bloqueados));
          setMedicamentosRecetaBD(dataConReceta);
        }

        // 3. Gestión de Rate Limit para pedidos
        const { rateLimitService } = await import('@/services/supabase/retelimitPedidos');
        await rateLimitService.limpiarExpirados();
        const nombresBloqueados = await rateLimitService.obtenerNombresBloqueados();
        setNombresBloqueadosRateLimit(nombresBloqueados);

        // 4. Inicialización de stock
        const stockInicial: Record<string, number> = {};
        [...dataSinReceta, ...dataConReceta].forEach(med => {
          stockInicial[med.id] = med.stock ?? 0;
        });

        // 5. Sincronización de stock con carrito existente
        if (carritoParam) {
          try {
            const datosRecibidos = JSON.parse(carritoParam as string) as CarritoItem[];
            datosRecibidos.forEach(item => {
              if (stockInicial[item.medicamento.id] !== undefined) {
                const stockActual = stockInicial[item.medicamento.id];
                stockInicial[item.medicamento.id] = Math.max(0, stockActual - item.cantidad);
              }
            });

            const recuperadosConReceta = datosRecibidos.filter(item =>
              dataConReceta.some(m => m.id === item.medicamento.id)
            );
            const recuperadosSinReceta = datosRecibidos.filter(item =>
              !dataConReceta.some(m => m.id === item.medicamento.id)
            );

            setConReceta(recuperadosConReceta);
            setSinReceta(recuperadosSinReceta);
            setMedicamentosRecetaSeleccionados(new Set(recuperadosConReceta.map(m => m.medicamento.id)));
          } catch (e) {
            console.log(`[${new Date().toLocaleTimeString()}] Error parseando carritoParam`, e);
          }
        }

        setStock(stockInicial);
      } catch (err: any) {
        console.log(`[${new Date().toLocaleTimeString()}] Error en Hall fetch:`, err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, [tieneReceta, medicamentosReceta, carritoParam]);

  // --- Lógica de Negocio y Manejadores ---

  /**
   * Agrupa los medicamentos por su categoría/familia.
   */
  const medicamentosPorFamilia: Record<string, Medicamento[]> = medicamentosBD.reduce(
    (acc, med) => {
      const familia = med.familia || "Otros";
      if (!acc[familia]) acc[familia] = [];
      acc[familia].push(med);
      return acc;
    },
    {} as Record<string, Medicamento[]>
  );

  /**
   * Elimina un producto del carrito y devuelve su cantidad al stock.
   */
  const handleRemoveProducto = (id: string) => {
    console.log(`[${new Date().toLocaleTimeString()}] Eliminando producto: ${id}`);
    const medCon = conReceta.find(m => m.medicamento.id === id);
    const medSin = sinReceta.find(m => m.medicamento.id === id);

    if (medCon) {
      setConReceta(prev => prev.filter(item => item.medicamento.id !== id));
      setMedicamentosRecetaSeleccionados(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setStock(prev => ({ ...prev, [id]: (prev[id] ?? 0) + medCon.cantidad }));
      setTodosRecetaAnadidos(false);
    } else if (medSin) {
      setSinReceta(prev => prev.filter(item => item.medicamento.id !== id));
      setStock(prev => ({ ...prev, [id]: (prev[id] ?? 0) + medSin.cantidad }));
    }
  };

  /**
   * Incrementa la cantidad de un producto sin receta respetando límites y stock.
   */
  const handleIncrementar = (id: string) => {
    setSinReceta((prev) =>
      prev.map((item) => {
        if (item.medicamento.id === id) {
          if (item.cantidad >= 3) return item;
          const stockActual = stock[id] ?? 0;
          if (stockActual <= 0) return item;

          setStock((prevStock) => ({
            ...prevStock,
            [id]: prevStock[id] - 1,
          }));
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      })
    );
  };

  /**
   * Decrementa la cantidad de un producto y actualiza el stock.
   */
  const handleDecrementar = (id: string) => {
    setSinReceta(prev => prev.map(ci =>
      ci.medicamento.id === id && ci.cantidad > 1 ? { ...ci, cantidad: ci.cantidad - 1 } : ci
    ));
    setStock(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  /**
   * Añade un medicamento con receta al carrito tras validar bloqueos.
   */
  const handleAgregarConReceta = (med: Medicamento) => {
    if (medicamentosBloqueados.has(med.id)) {
      console.log(`[${new Date().toLocaleTimeString()}] Intento de agregar med bloqueado: ${med.id}`);
      return;
    }
    if (!medicamentosRecetaSeleccionados.has(med.id)) {
      const nuevosSeleccionados = new Set([...medicamentosRecetaSeleccionados, med.id]);
      setConReceta(prev => [...prev, { medicamento: med, cantidad: 1 }]);
      setMedicamentosRecetaSeleccionados(nuevosSeleccionados);
      setStock(prev => ({ ...prev, [med.id]: (prev[med.id] ?? 100) - 1 }));

      const todosAnadidos = medicamentosRecetaBD.every(m => nuevosSeleccionados.has(m.id));
      setTodosRecetaAnadidos(todosAnadidos);
    }
  };

  /**
   * Añade un medicamento sin receta al carrito.
   */
  const handleAgregarSinReceta = (med: Medicamento) => {
    setSinReceta(prev => [...prev, { medicamento: med, cantidad: 1 }]);
    setStock(prev => ({ ...prev, [med.id]: (prev[med.id] ?? 100) - 1 }));
  };

  /**
   * Alterna la visibilidad de las categorías en la lista.
   */
  const toggleCategory = (categoria: string) => {
    setExpandedCategories(prev => ({ ...prev, [categoria]: !prev[categoria] }));
  };

  /**
   * Procesa la navegación a la pantalla de pago tras validar el total.
   */
  const comprar = async () => {
    if (carrito.length === 0) return;

    const navegar = () => {
      console.log(`[${new Date().toLocaleTimeString()}] Navegando a FormaPago con total: ${totalGeneral}`);
      router.push({
        pathname: "/screens/shop/FormaPago",
        params: { 
          total: totalGeneral.toFixed(2),
          carrito: JSON.stringify(carrito),
          telefono: telefono,
          tieneReceta: tieneReceta ? 'true' : 'false',
          medicamentosReceta: medicamentosReceta,
          dni: dni
        },
      });
    };

    if (totalGeneral >= 1000) {
      Alert.alert(
        t("Hall.ADVERTENCIA_TITULO") || "Aviso de Pago",
        t("Hall.ADVERTENCIA_MENSAJE") || "Tu pedido supera los 1000€...",
        [
          { text: t("Hall.CANCELAR") || "Cancelar", style: "cancel" },
          { text: t("Hall.ACEPTAR") || "Continuar", onPress: navegar }
        ]
      );
    } else {
      navegar();
    }
  };

  /**
   * Limpia el carrito y vuelve a la pantalla de inicio.
   */
  const cancelar = () => {
    Alert.alert(
      t("Hall.DESEASSALIR"),
      t("Hall.PERDERPROGRESO"),
      [
        { text: t("Hall.PERMANECERAQUÍ"), style: "cancel" },
        {
          text: t("Hall.SALIR"),
          onPress: () => {
            console.log(`[${new Date().toLocaleTimeString()}] Cancelando compra y vaciando carrito.`);
            setSinReceta([]);
            setConReceta([]);
            setMedicamentosRecetaSeleccionados(new Set());
            router.replace("/screens/home/Home");
          }
        },
      ]
    );
  };

  // --- Funciones de Traducción de Datos ---
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

  /**
   * Renderiza cada elemento dentro de la lista del carrito.
   * Incluye controles de cantidad para productos sin receta y opción de eliminación.
   */
  const renderItem = ({ item }: { item: CarritoItem }) => {
    const esSinReceta = sinReceta.some(ci => ci.medicamento.id === item.medicamento.id);
    
    return (
      <View style={styles.itemCard}>
        <Image 
          source={{ uri: item.medicamento.img_medicamento?.trim() || "https://via.placeholder.com/70" }} 
          style={styles.itemImage} 
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.medicamento.nombre}</Text>
          <Text style={styles.itemText}>{MarcaGenericaTradución(item.medicamento.marca || "")}</Text>
          <Text style={styles.itemText}>{t("Hall.STOCK")}: {stock[item.medicamento.id] ?? 0}</Text>
          <Text style={styles.itemPrice}>{item.medicamento.precio.toFixed(2)} €</Text>
        </View>

        {/* Controles de incremento/decremento solo para productos sin receta */}
        {esSinReceta && (
          <View style={{ alignItems: "center", justifyContent: "center", marginRight: 15 }}>
            <Pressable 
              onPress={() => {
                console.log(`[${new Date().toLocaleTimeString()}] Incrementando: ${item.medicamento.nombre}`);
                handleIncrementar(item.medicamento.id);
              }} 
              disabled={item.cantidad >= 3 || (stock[item.medicamento.id] ?? 0) <= 0}
            >
              <MaterialIcons 
                name="keyboard-arrow-up" 
                size={28} 
                color={(item.cantidad >= 3 || (stock[item.medicamento.id] ?? 0) <= 0) ? "#666" : "#fff"} 
              />
            </Pressable>

            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
              {item.cantidad}
            </Text>

            <Pressable 
              onPress={() => {
                console.log(`[${new Date().toLocaleTimeString()}] Decrementando: ${item.medicamento.nombre}`);
                handleDecrementar(item.medicamento.id);
              }} 
              disabled={item.cantidad <= 1}
            >
              <MaterialIcons 
                name="keyboard-arrow-down" 
                size={28} 
                color={item.cantidad <= 1 ? "#666" : "#fff"} 
              />
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
            {/* --- SECCIÓN: MEDICAMENTOS CON RECETA --- */}
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

                  {/* Feedback visual cuando no quedan recetas pendientes por añadir */}
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
              <Pressable style={styles.card}>
                <View style={[styles.cardHeader]}>
                  <View>
                    <Text style={styles.cardTitle}>{t("Hall.CONRECETA")}</Text>
                    <Text style={styles.subText}>{t("Hall.TIENESRECETA")}</Text>
                  </View>
                </View>
                <Text style={styles.mediumText}>{t("Hall.NOHAYRECETA")}</Text>
              </Pressable>
            )}

            {/* --- SECCIÓN: MEDICAMENTOS SIN RECETA --- */}
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
        ListFooterComponent={
          <View style={{ paddingVertical: 20 }}>
            <Text style={styles.totalText}>
              {carrito.reduce((acc, ci) => acc + ci.cantidad, 0)} {t("Hall.ARTICULOS")}
            </Text>
            <Text style={styles.totalText}>{t("Hall.TOTAL")}: {totalGeneral.toFixed(2)} €</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 170 }}
      />

      {/* --- MODAL: BÚSQUEDA Y FILTRO POR CATEGORÍA --- */}
      <Modal visible={showDrawer} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowDrawer(false)}>
          <View style={styles.drawer}>
            <TextInput 
              placeholder={t("Hall.BUSCAR")} 
              value={search} 
              onChangeText={setSearch} 
              style={styles.searchInput} 
            />
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
                      const bloqueadoPorRateLimit = nombresBloqueadosRateLimit.has(med.nombre.toLowerCase().trim());
                      const bloqueado = sinRecetaIds.has(med.id) || stockActual <= 0 || bloqueadoPorRateLimit;

                      return (
                        <Pressable
                          key={med.id}
                          style={[styles.medicamentCard, bloqueado && { opacity: 0.4 }]}
                          onPress={() => { 
                            if (!bloqueado) { 
                              console.log(`[${new Date().toLocaleTimeString()}] Seleccionado desde filtro: ${med.nombre}`);
                              handleAgregarSinReceta(med); 
                              setShowDrawer(false); 
                            } 
                          }}
                          disabled={bloqueado}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={styles.medicamentName}>{med.nombre}</Text>
                            {bloqueadoPorRateLimit && <Text style={{color: '#d82215', fontSize: 10}}>⚠️ {t("Hall.LIMITE_ALCANZADO")}</Text>}
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

      {/* --- MODAL: AÑADIR SIN FILTRO --- */}
      <Modal visible={showNofilterDrawer} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setshowNofilterDrawer(false)}>
          <View style={styles.drawer}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>{t("Hall.AÑADIRMEDICAMENTO")}</Text>
            <ScrollView>
              {medicamentosBD.filter((m) => m.nombre.toLowerCase().includes(search.toLowerCase())).map((med) => {
                const stockActual = stock[med.id] ?? med.stock ?? 0;
                const bloqueadoPorRateLimit = nombresBloqueadosRateLimit.has(med.nombre.toLowerCase().trim());
                const bloqueado = sinRecetaIds.has(med.id) || stockActual <= 0 || bloqueadoPorRateLimit;

                return (
                  <Pressable
                    key={med.id}
                    style={[styles.medicamentCard, bloqueado && { opacity: 0.4 }]}
                    onPress={() => { 
                      if (bloqueado) return; 
                      console.log(`[${new Date().toLocaleTimeString()}] Seleccionado sin filtro: ${med.nombre}`);
                      handleAgregarSinReceta(med); 
                      setshowNofilterDrawer(false); 
                      setSearch(""); 
                    }}
                    disabled={bloqueado}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.medicamentName}>{med.nombre}</Text>
                      {bloqueadoPorRateLimit && <Text style={{color: '#d82215', fontSize: 10}}>⚠️ {t("Hall.LIMITE_ALCANZADO")}</Text>}
                      <Text style={styles.medicamentSubtext}>{t("Hall.STOCK")}: {stockActual} • {MarcaGenericaTradución(med.marca || "")}</Text>
                    </View>
                    <Text style={styles.medicamentPrice}>{med.precio.toFixed(2)} €</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* --- Botones de compra y cancelación --- */}
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