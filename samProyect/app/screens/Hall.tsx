import React, { useState, useEffect } from "react";
import {
  View, Text, Pressable, FlatList,
  Modal, Image, ScrollView, TextInput, ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { styles } from "../../styles/HallStyle";
import { medicamentosService, Medicamento } from "@/services/supabase/medicamentos.service";

function Hall() {
  const { dni, medicamentosReceta, tieneReceta: tieneRecetaParam } = useLocalSearchParams();

  const [showDrawer, setShowDrawer] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [sinReceta, setSinReceta] = useState<Medicamento[]>([]);
  const [conReceta, setConReceta] = useState<Medicamento[]>([]);
  const [search, setSearch] = useState("");
  const [medicamentosBD, setMedicamentosBD] = useState<Medicamento[]>([]);
  const [medicamentosRecetaBD, setMedicamentosRecetaBD] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medicamentosRecetaSeleccionados, setMedicamentosRecetaSeleccionados] = useState<Set<string>>(new Set());

  const tieneReceta = tieneRecetaParam === "true";

  console.log("💊 medicamentosReceta (parámetro):", medicamentosReceta);
  console.log("📋 tieneReceta:", tieneReceta);

  // ✅ Cargar medicamentos al montar
  useEffect(() => {
    const fetchMedicamentos = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🚀 Iniciando carga de medicamentos...");

        // 1. Obtener medicamentos SIN receta
        const dataSinReceta = await medicamentosService.obtenerSinReceta();
        console.log("✅ Medicamentos sin receta cargados:", dataSinReceta.length);
        setMedicamentosBD(dataSinReceta);

        // 2. ✅ Obtener medicamentos CON receta si tiene receta
        if (tieneReceta && medicamentosReceta) {
          console.log("📋 Procesando medicamentos con receta...");
          console.log("   medicamentosReceta:", medicamentosReceta);

          // Parsear nombres de medicamentos con receta
          const nombresReceta = typeof medicamentosReceta === 'string'
            ? medicamentosReceta
                .split(",")
                .map(m => m.trim())
                .filter(m => m !== "")
            : [];

          console.log("   Nombres parseados:", nombresReceta);

          if (nombresReceta.length > 0) {
            // Obtener TODOS los medicamentos
            const todosMedicamentos = await medicamentosService.obtenerTodos();
            console.log("   Total medicamentos en BD:", todosMedicamentos.length);

            // Filtrar por nombre (case-insensitive)
            const dataConReceta = todosMedicamentos.filter(med => {
              const encontrado = nombresReceta.some(nombre =>
                med.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
              );
              
              if (encontrado) {
                console.log(`   ✅ Encontrado: ${med.nombre}`);
              }
              
              return encontrado;
            });

            console.log("✅ Medicamentos con receta encontrados:", dataConReceta.length);
            setMedicamentosRecetaBD(dataConReceta);
          } else {
            console.log("⚠️ No hay nombres de medicamentos con receta");
            setMedicamentosRecetaBD([]);
          }
        } else {
          console.log("⚠️ No tiene receta activa o sin medicamentosReceta");
          setMedicamentosRecetaBD([]);
        }

      } catch (err: any) {
        console.error("❌ Error:", err.message);
        setError(err.message);
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
    const medicamentoConReceta = conReceta.find(m => m.id === id);
    const medicamentoSinReceta = sinReceta.find(m => m.id === id);

    if (medicamentoConReceta) {
      // ✅ Remover de carrito con receta
      setConReceta((prev) => prev.filter((item) => item.id !== id));
      // ✅ Remover del Set de seleccionados
      setMedicamentosRecetaSeleccionados((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      console.log("🗑️ Medicamento con receta removido:", medicamentoConReceta.nombre);
    } else if (medicamentoSinReceta) {
      // ✅ Remover de carrito sin receta
      setSinReceta((prev) => prev.filter((item) => item.id !== id));
      console.log("🗑️ Medicamento sin receta removido:", medicamentoSinReceta.nombre);
    }
  };

  // ✅ Agregar medicamento CON receta (máximo una vez)
  const handleAgregarConReceta = (med: Medicamento) => {
    if (!medicamentosRecetaSeleccionados.has(med.id)) {
      setConReceta((prev) => [...prev, med]);
      setMedicamentosRecetaSeleccionados((prev) => new Set([...prev, med.id]));
      console.log("✅ Medicamento con receta agregado:", med.nombre);
    }
  };

  const toggleCategory = (categoria: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  const totalSinReceta = sinReceta.reduce((total, item) => total + item.precio, 0);
  const totalConReceta = conReceta.reduce((total, item) => total + item.precio, 0);
  const totalGeneral = totalSinReceta + totalConReceta;

  const carrito = [...conReceta, ...sinReceta];

  const renderItem = ({ item }: { item: Medicamento }) => (
    <View style={styles.itemCard}>
      <Image
        source={{
          uri: item.img_medicamento?.trim()
            ? item.img_medicamento
            : "https://via.placeholder.com/70",
        }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemText}>{item.marca}</Text>
        <Text style={styles.itemText}>{item.familia}</Text>
        <Text style={styles.itemPrice}>{item.precio.toFixed(2)} €</Text>
      </View>
      <Pressable onPress={() => handleRemoveProducto(item.id)}>
        <MaterialIcons name="delete" size={22} color="#E63946" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            {/* ✅ CON RECETA */}
            {tieneReceta && medicamentosRecetaBD.length > 0 ? (
              <View style={[styles.card, { paddingBottom: 0 }]}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>CON RECETA</Text>
                    <Text style={styles.subText}>Medicamentos recetados</Text>
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
                      Todos los medicamentos han sido agregados al carrito
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
                    <Text style={styles.cardTitle}>CON RECETA</Text>
                    <Text style={styles.subText}>¿Tienes receta?</Text>
                  </View>
                  <MaterialIcons name="launch" size={24} color="#fff" />
                </View>
                <Text style={styles.mediumText}>
                  No hay productos con receta disponibles
                </Text>
              </Pressable>
            )}

            {/* SIN RECETA HEADER */}
            <View style={styles.card2}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>SIN RECETA</Text>
                <Pressable
                  style={styles.filterButton}
                  onPress={() => setShowDrawer(true)}
                >
                  <MaterialIcons name="filter-list" size={18} color="#ffffff" />
                  <Text style={styles.filterText}>Filtrar medicamentos</Text>
                </Pressable>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{ paddingVertical: 20 }}>
            <Text style={styles.totalText}>
              Total: {totalGeneral.toFixed(2)} €
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* BOTONES FIJOS ABAJO */}
      <View style={styles.bottomButtons}>
        <Pressable
          style={[styles.bottomButton, carrito.length === 0 && { opacity: 0.5 }]}
          onPress={() => router.push({
            pathname: "/screens/FormaPago",
            params: { total: totalGeneral.toFixed(2) },
          })}
          disabled={carrito.length === 0}
        >
          <Text style={styles.bottomButtonText}>COMPRAR</Text>
        </Pressable>
        <Pressable
          style={styles.bottomButtonVolver}
          onPress={() => router.push("/screens/Home")}
        >
          <Text style={styles.bottomButtonText}>CANCELAR</Text>
        </Pressable>
      </View>

      {/* DRAWER */}
      <Modal visible={showDrawer} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowDrawer(false)}>
          <Pressable style={styles.drawer}>
            <TextInput
              placeholder="Buscar medicamento..."
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
                        style={styles.drawerCategoryButton}
                      >
                        <Text style={styles.drawerCategory}>{familia}</Text>
                        <MaterialIcons
                          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                          size={20}
                          color="#ffffff"
                        />
                      </Pressable>

                      {isExpanded &&
                        filtrados.map((med) => (
                          <Pressable
                            key={med.id}
                            style={styles.medicamentCard}
                            onPress={() => {
                              setSinReceta((prev) => [...prev, med]);
                              setShowDrawer(false);
                              setSearch("");
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