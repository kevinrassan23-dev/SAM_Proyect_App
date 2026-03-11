import React, { useState, useEffect } from "react";
import {
  View, Text, Pressable, FlatList,
  Modal, Image, ScrollView, TextInput, ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "../../styles/HallStyle";
import { getMedicamentosSinReceta, Medicamento } from "../../services/supabase/medicamentos.service";

function Hall() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [sinReceta, setSinReceta] = useState<Medicamento[]>([]);
  const [search, setSearch] = useState("");
  const [medicamentosBD, setMedicamentosBD] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMedicamentosSinReceta();
        setMedicamentosBD(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicamentos();
  }, []);

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
    setSinReceta((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCategory = (categoria: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  const totalSinReceta = sinReceta.reduce((total, item) => total + item.precio, 0);

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
        data={sinReceta}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            {/* CON RECETA */}
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
          <Text style={styles.totalText}>
            Total: {totalSinReceta.toFixed(2)} €
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      {/* BOTONES FIJOS ABAJO */}
      <View style={styles.bottomButtons}>
        <Pressable
          style={styles.bottomButton}
          onPress={() => router.push({
            pathname: "/screens/FormaPago",
            params: { total: totalSinReceta.toFixed(2) },
          })}
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
                            style={styles.drawerItem}
                            onPress={() => {
                              setSinReceta((prev) => [...prev, med]);
                              setShowDrawer(false);
                              setSearch("");
                            }}
                          >
                            <Text style={styles.drawerItem}>{med.nombre}</Text>
                            <Text style={styles.drawerItem}>{med.precio.toFixed(2)} €</Text>
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