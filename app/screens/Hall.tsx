import { Medicamento, medicamentosService } from "@/services/supabase/medicamentos.service";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "../../styles/HallStyle";

type carrito = { medicamento: Medicamento; cantidad: number };

function Hall() {
  const { t } = useTranslation();

  const { medicamentosReceta, tieneReceta: tieneRecetaParam } = useLocalSearchParams();
  const [sinReceta, setSinReceta] = useState<carrito[]>([]);
  const [conReceta, setConReceta] = useState<carrito[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showNofilterDrawer, setshowNofilterDrawer] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [medicamentosBD, setMedicamentosBD] = useState<Medicamento[]>([]);
  const [medicamentosRecetaBD, setMedicamentosRecetaBD] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medicamentosRecetaSeleccionados, setMedicamentosRecetaSeleccionados] = useState<Set<string>>(new Set());
  const tieneReceta = tieneRecetaParam === "true";
  const sinRecetaIds = new Set(sinReceta.map(ci => ci.medicamento.id));
  const [stock, setStock] = useState<Record<string, number>>({});

  console.log(new Date().toLocaleTimeString(), + " medicamentosReceta (parámetro):", medicamentosReceta);
  console.log(new Date().toLocaleTimeString(), + " tieneReceta:", tieneReceta);

  // ✅ Cargar medicamentos al montar
  useEffect(() => {
    const fetchMedicamentos = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(new Date().toLocaleTimeString(), + " Iniciando carga de medicamentos...");

        // 1. Obtener medicamentos SIN receta
        const dataSinReceta = await medicamentosService.obtenerSinReceta();
        console.log(new Date().toLocaleTimeString(), + " Medicamentos sin receta cargados:", dataSinReceta.length);
        setMedicamentosBD(dataSinReceta);

        // 2. darle a cada medicamento un stock de 50       
        const stockInicial: Record<string, number> = {};
        dataSinReceta.forEach(med => { stockInicial[med.id] = 50; });
        setStock(stockInicial);

        // 3. ✅ Obtener medicamentos CON receta si tiene receta
        if (tieneReceta && medicamentosReceta) {
          console.log(new Date().toLocaleTimeString(), + " Procesando medicamentos con receta...");
          console.log(new Date().toLocaleTimeString(), + " medicamentosReceta:", medicamentosReceta);

          // Parsear nombres de medicamentos con receta
          const nombresReceta = typeof medicamentosReceta === 'string'
            ? medicamentosReceta
              .split(",")
              .map(m => m.trim())
              .filter(m => m !== "")
            : [];

          console.log(new Date().toLocaleTimeString(), + " Nombres parseados:", nombresReceta);

          if (nombresReceta.length > 0) {
            // Obtener TODOS los medicamentos
            const todosMedicamentos = await medicamentosService.obtenerTodos();
            console.log(new Date().toLocaleTimeString(), + " Total medicamentos en BD:", todosMedicamentos.length);

            // Filtrar por nombre (case-insensitive)
            const dataConReceta = todosMedicamentos.filter(med => {
              const encontrado = nombresReceta.some(nombre =>
                med.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
              );

              if (encontrado) {
                console.log(new Date().toLocaleTimeString(), + ` Encontrado: ${med.nombre}`);
              }

              return encontrado;
            });

            console.log(new Date().toLocaleTimeString(), + " Medicamentos con receta encontrados:", dataConReceta.length);
            setMedicamentosRecetaBD(dataConReceta);
          } else {
            console.log(new Date().toLocaleTimeString(), + " No hay nombres de medicamentos con receta");
            setMedicamentosRecetaBD([]);
          }
        } else {
          console.log(new Date().toLocaleTimeString(), + " No tiene receta activa o sin medicamentosReceta");
          setMedicamentosRecetaBD([]);
        }

      } catch (e: any) {
        console.log(new Date().toLocaleTimeString(), + " " + e?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, [tieneReceta, medicamentosReceta]);

  const medicamentosPorFamilia: Record<string, Medicamento[]> = medicamentosBD.reduce(
    (acc, med) => {
      const familia = med.familia || "Otros";
      if (!acc[familia]) acc[familia] = [];
      acc[familia].push(med);
      return acc;
    },
    {} as Record<string, Medicamento[]>
  );

  // ✅ Remover producto del carrito Y devolver a disponibles
  const handleRemoveProducto = (id: string) => {
    // Buscar si es de receta o sin receta
    const esConReceta = conReceta.find(ci => ci.medicamento.id === id);
    const esSinReceta = sinReceta.find(ci => ci.medicamento.id === id);

    if (esConReceta) {
      // ✅ Remover de carrito con receta
      setConReceta((prev) => prev.filter((item) => item.medicamento.id !== id));
      // ✅ Remover del Set de seleccionados
      setMedicamentosRecetaSeleccionados((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      console.log(new Date().toLocaleTimeString(), + " Medicamento con receta removido:", esConReceta.medicamento.nombre);
    } else if (esSinReceta) {
      // ✅ Remover de carrito sin receta
      setSinReceta((prev) => prev.filter((item) => item.medicamento.id !== id));
      setStock(prev => ({ ...prev, [id]: (prev[id] ?? 50) + esSinReceta.cantidad }));
      console.log(new Date().toLocaleTimeString(), + " Medicamento sin receta removido:", esSinReceta.medicamento.nombre);
    }
  };

  const handleIncrementar = (id: string) => {
    if ((stock[id] ?? 50) <= 0) return;
    setSinReceta(prev =>
      prev.map(ci =>
        ci.medicamento.id === id && ci.cantidad < 4
          ? { ...ci, cantidad: ci.cantidad + 1 }
          : ci
      )
    );
    setStock(prev => ({ ...prev, [id]: (prev[id] ?? 50) - 1 }));
  };

  const handleDecrementar = (id: string) => {
    setSinReceta(prev =>
      prev.map(ci =>
        ci.medicamento.id === id && ci.cantidad > 1
          ? { ...ci, cantidad: ci.cantidad - 1 }
          : ci
      )
    );
    setStock(prev => ({ ...prev, [id]: (prev[id] ?? 50) + 1 }));
  };
  // ✅ Agregar medicamento CON receta (máximo una vez)
  const handleAgregarConReceta = (med: Medicamento) => {
    if (!medicamentosRecetaSeleccionados.has(med.id)) {
      setConReceta(prev => [...prev, { medicamento: med, cantidad: 1 }]); setMedicamentosRecetaSeleccionados((prev) => new Set([...prev, med.id]));
      console.log(new Date().toLocaleTimeString(), + " Medicamento con receta agregado:", med.nombre);
    }
  };

  const toggleCategory = (categoria: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  const totalSinReceta = sinReceta.reduce((total, ci) => total + ci.medicamento.precio * ci.cantidad, 0);
  const totalConReceta = conReceta.reduce((total, ci) => total + ci.medicamento.precio * ci.cantidad, 0);
  const totalGeneral = totalSinReceta + totalConReceta;

  const carrito = [...conReceta, ...sinReceta];

  const FamiliaTradución = (familia: string): string => {
    switch (familia.toLowerCase().trim()) {
      case "gripe y resfriado": return t("Hall.GRIPEYRESFRIADO");
      case "analgésicos": return t("Hall.ANALGÉSICOS");
      case "alérgenos": return t("Hall.ALÉRGENOS");
      case "dieta y nutrición": return t("Hall.DIETAYNUTRICIÓN");
      case "cuidado del cabello y piel": return t("Hall.CUIDADODELCABELLOYPIEL");
      case "salud bucal": return t("Hall.SALUDBUSCAL");
      case "primeros auxilios": return t("Hall.PRIMEROSAUXILIOS");
      default: return "";
    }
  };

  const renderItem = ({ item }: { item: carrito }) => {
    const esSinReceta = sinReceta.some(ci => ci.medicamento.id === item.medicamento.id);
    const Tradución = FamiliaTradución(item.medicamento.familia || "");
    return (
      <View style={styles.itemCard}>
        <Image
          source={{
            uri: item.medicamento.img_medicamento?.trim()
              ? item.medicamento.img_medicamento
              : "https://via.placeholder.com/70",
          }}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.medicamento.nombre}</Text>
          <Text style={styles.itemText}>{item.medicamento.marca}</Text>
          {Tradución ? <Text style={styles.itemText}>{Tradución}</Text> : null}
          <Text style={styles.itemText}>Stock: {stock[item.medicamento.id] ?? 50}</Text>
          <Text style={styles.itemPrice}>{item.medicamento.precio.toFixed(2)} €</Text>
        </View>

        {esSinReceta && (
          <View style={{ alignItems: "center", justifyContent: "center", marginRight: 8 }}>
            <Pressable
              onPress={() => handleIncrementar(item.medicamento.id)}
              disabled={item.cantidad >= 4 || (stock[item.medicamento.id] ?? 50) <= 0}
            >
              <MaterialIcons
                name="keyboard-arrow-up"
                size={24}
                color={item.cantidad >= 4 || (stock[item.medicamento.id] ?? 50) <= 0 ? "#aaa" : "#fff"} />
            </Pressable>

            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              {item.cantidad}
            </Text>

            <Pressable
              onPress={() => handleDecrementar(item.medicamento.id)}
              disabled={item.cantidad <= 1}
            >
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={item.cantidad <= 1 ? "#aaa" : "#fff"}
              />
            </Pressable>
          </View>
        )}

        <Pressable onPress={() => handleRemoveProducto(item.medicamento.id)}>
          <MaterialIcons name="delete" size={22} color="#E63946" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={carrito}
        keyExtractor={(item, index) => `${item.medicamento.id}-${index}`} renderItem={renderItem}
        ListHeaderComponent={
          <>
            {/* ✅ CON RECETA */}
            {tieneReceta && medicamentosRecetaBD.length > 0 ? (
              <View style={[styles.card, { paddingBottom: 0 }]}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{t("Hall.CONRECETA")}</Text>
                    <Text style={styles.subText}>{t("Hall.MEDICAMENTOSRECETADOS")}</Text>
                  </View>
                </View>

                {/* Mostrar medicamentos con receta DISPONIBLES (no seleccionados) */}
                {medicamentosRecetaBD
                  .filter(med => !medicamentosRecetaSeleccionados.has(med.id))
                  .length > 0 ? (
                  <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                    {medicamentosRecetaBD
                      .filter(med => !medicamentosRecetaSeleccionados.has(med.id))
                      .map((med) => (
                        <Pressable
                          key={med.id}
                          style={styles.medicamentCard}
                          onPress={() => {
                            handleAgregarConReceta(med);
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={styles.medicamentName}>{med.nombre}</Text>
                            <Text style={styles.medicamentSubtext}>
                              {med.marca} • {med.familia}
                            </Text>
                          </View>
                          <Text style={styles.medicamentPrice}>
                            {med.precio.toFixed(2)} €
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                ) : (
                  <View style={[styles.emptyContainer, { paddingHorizontal: 16, paddingVertical: 24 }]}>
                    <MaterialIcons name="shopping-cart" size={48} color="#999" />
                    <Text style={styles.emptyText}>
                      {t("Hall.MEDICAMENTOSAGREGADOS")}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <Pressable
                style={styles.card}
                onPress={() => router.push("/screens/IngresarCartilla")}
              >
                <View style={[styles.cardHeader, styles.flecha]}>
                  <View>
                    <Text style={styles.cardTitle}>{t("Hall.CONRECETA")}</Text>
                    <Text style={styles.subText}>{t("Hall.TIENESRECETA")}</Text>
                  </View>
                  <MaterialIcons name="launch" size={24} color="#fff" />
                </View>
                <Text style={styles.mediumText}>
                  {t("Hall.NOHAYRECETA")}
                </Text>
              </Pressable>
            )}

            {/* SIN RECETA HEADER */}
            <View style={styles.card2}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>{t("Hall.SINRECETA")}</Text>
                <Pressable
                  style={styles.filterButton}
                  onPress={() => setShowDrawer(true)}
                >
                  <MaterialIcons name="filter-list" size={18} color="#ffffff" />
                  <Text style={styles.filterText}>{t("Hall.FILTRAR")}</Text>
                </Pressable>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{ paddingVertical: 40 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={styles.totalText}>{carrito.reduce((acc, ci) => acc + ci.cantidad, 0)} {t("Hall.ARTICULOS")}</Text>
              <Text style={styles.totalText}>
                {t("Hall.TOTAL")}: {totalGeneral.toFixed(2)} €
              </Text>
            </View>
            <Pressable
              style={styles.bottomButton}
              onPress={() => setshowNofilterDrawer(true)}>
              <Text style={styles.bottomButtonText}>{t("Hall.CARROAÑADIR")}</Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 120 }}

      />

      {/* BOTONES FIJOS ABAJO */}
      <View style={styles.bottomButtons}>
        <Pressable
          style={[styles.bottomButton, carrito.length === 0 && { opacity: 0.4 }]}
          onPress={() => {
            if (carrito.length === 0) return;
            router.push({
              pathname: "/screens/FormaPago",
              params: { total: totalGeneral.toFixed(2) }
            });
          }}
        >
          <Text style={styles.bottomButtonText}>{t("Hall.COMPRAR")}</Text>
        </Pressable>
        <Pressable
          style={styles.bottomButtonVolver}
          onPress={() => router.push("/screens/Home")}
        >
          <Text style={styles.bottomButtonText}>{t("Hall.CANCELAR")}</Text>
        </Pressable>
      </View>



      {/* DRAWER */}
      <Modal visible={showDrawer} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowDrawer(false)}>
          <Pressable style={styles.drawer}>
            <TextInput
              placeholder={t("Hall.BUSCAR")}
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />

            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
            ) : error ? (
              <Text style={{ color: "#E63946", textAlign: "center", marginTop: 20 }}>
                {error}
              </Text>
            ) : (
              <ScrollView>
                {Object.entries(medicamentosPorFamilia).map(([familia, meds]) => {
                  const filtrados = meds.filter((m) =>
                    m.nombre.toLowerCase().includes(search.toLowerCase())
                  );
                  if (filtrados.length === 0) return null;
                  const isExpanded = expandedCategories[familia];

                  return (
                    <View key={familia}>
                      <Pressable
                        onPress={() => toggleCategory(familia)}
                        style={styles.drawerCategoryButton}>
                        <Text style={styles.drawerCategory}>{FamiliaTradución(familia) || familia}</Text>
                        <MaterialIcons
                          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                          size={20}
                          color="#ffffff"
                        />
                      </Pressable>

                      {isExpanded &&
                        filtrados.map((med) => {
                          const enCarrito = sinRecetaIds.has(med.id);
                          const sinStock = (stock[med.id] ?? 50) <= 0;
                          return (
                            <Pressable
                              key={med.id}
                              style={[styles.medicamentCard, (enCarrito || sinStock) && { opacity: 0.4 }]}
                              onPress={() => {
                                if (enCarrito || sinStock) return;
                                setSinReceta(prev => [...prev, { medicamento: med, cantidad: 1 }]);
                                setStock(prev => ({ ...prev, [med.id]: (prev[med.id] ?? 50) - 1 }));
                                setShowDrawer(false);
                                setSearch("");
                              }}
                              disabled={enCarrito || sinStock}>
                              <View style={{ flex: 1 }}>
                                <Text style={styles.medicamentName}>{med.nombre}</Text>
                                <Text style={styles.medicamentSubtext}>Stock: {stock[med.id] ?? 50}</Text>
                                <Text style={styles.medicamentSubtext}>
                                  {med.marca} • {FamiliaTradución(med.familia || "") || med.familia}
                                </Text>
                              </View>
                              <Text style={styles.medicamentPrice}>
                                {med.precio.toFixed(2)} €
                              </Text>
                            </Pressable>
                          );
                        })}
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* NO FILTER DRAWER */}
      <Modal visible={showNofilterDrawer} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setshowNofilterDrawer(false)}>
          <Pressable style={styles.drawer}>
            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
            ) : error ? (
              <Text style={{ color: "#E63946", textAlign: "center", marginTop: 20 }}>
                {error}
              </Text>
            ) : (
              <ScrollView>
                {Object.values(medicamentosPorFamilia)
                  .flat()
                  .filter((m) => m.nombre.toLowerCase().includes(search.toLowerCase()))
                  .map((med, index) => {
                    const enCarrito = sinRecetaIds.has(med.id);
                    const sinStock = (stock[med.id] ?? 50) <= 0;
                    return (
                      <Pressable
                        key={`${med.id}-${index}`}
                        style={[styles.medicamentCard, (enCarrito || sinStock) && { opacity: 0.4 }]}
                        onPress={() => {
                          if (enCarrito || sinStock) return;
                          setSinReceta(prev => [...prev, { medicamento: med, cantidad: 1 }]);
                          setStock(prev => ({ ...prev, [med.id]: (prev[med.id] ?? 50) - 1 }));
                          setshowNofilterDrawer(false);
                          setSearch("");
                        }}
                        disabled={enCarrito || sinStock}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.medicamentName}>{med.nombre}</Text>
                          <Text style={styles.medicamentSubtext}>Stock: {stock[med.id] ?? 50}</Text>
                          <Text style={styles.medicamentSubtext}>
                            {med.marca} • {FamiliaTradución(med.familia || "") || med.familia}
                          </Text>
                        </View>
                        <Text style={styles.medicamentPrice}>
                          {med.precio.toFixed(2)} €
                        </Text>
                      </Pressable>
                    );
                  })}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default Hall;