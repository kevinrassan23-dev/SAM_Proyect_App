import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Modal,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* =======================
   INTERFACE
======================= */
interface Product {
  id: string;
  nombre: string;
  marca: string;
  tipo: string;
  precio: number;
}

/* =======================
   DATA
======================= */
const receta: Product[] = [];

const medicamentosPorCategoria: Record<string, Product[]> = {
  Analgésicos: [
    { id: "a1", nombre: "Ibudol", marca: "Genérico", tipo: "Cápsula", precio: 3.5 },
    { id: "a2", nombre: "Dolostop", marca: "Bayer", tipo: "Tableta", precio: 4.0 },
    { id: "a3", nombre: "Actron", marca: "Actron", tipo: "Cápsula", precio: 4.8 },
    { id: "a4", nombre: "Voltadol Forte", marca: "GSK", tipo: "Gel", precio: 6.2 },
    { id: "a5", nombre: "Epididol", marca: "Grünenthal", tipo: "Tableta", precio: 5.0 },
  ],
  Alérgenos: [
    { id: "al1", nombre: "Loratadina", marca: "MK", tipo: "Tableta", precio: 3.0 },
    { id: "al2", nombre: "Cetirizina", marca: "Bayer", tipo: "Tableta", precio: 3.8 },
    { id: "al3", nombre: "Desloratadina", marca: "Normon", tipo: "Tableta", precio: 4.2 },
    { id: "al4", nombre: "Fexofenadina", marca: "Teva", tipo: "Tableta", precio: 4.5 },
    { id: "al5", nombre: "Clorfenamina", marca: "Genérico", tipo: "Jarabe", precio: 2.8 },
  ],
  "Gripe y resfriado": [
    { id: "g1", nombre: "Frenadol", marca: "Bayer", tipo: "Sobres", precio: 6.0 },
    { id: "g2", nombre: "Vick Jarabe", marca: "Vick", tipo: "Jarabe", precio: 5.5 },
    { id: "g3", nombre: "Couldina", marca: "Bial", tipo: "Sobres", precio: 5.8 },
    { id: "g4", nombre: "Gripavick", marca: "Vick", tipo: "Jarabe", precio: 5.2 },
    { id: "g5", nombre: "Next", marca: "Next", tipo: "Cápsula", precio: 6.3 },
  ],
  "Dieta y nutrición": [
    { id: "d1", nombre: "Multivitamínico", marca: "Centrum", tipo: "Tableta", precio: 7.5 },
    { id: "d2", nombre: "Omega 3", marca: "Solgar", tipo: "Cápsula", precio: 9.5 },
    { id: "d3", nombre: "Vitamina C", marca: "Redoxon", tipo: "Efervescente", precio: 6.5 },
    { id: "d4", nombre: "Colágeno", marca: "AML", tipo: "Polvo", precio: 10.0 },
    { id: "d5", nombre: "Magnesio", marca: "Ana María", tipo: "Tableta", precio: 8.0 },
  ],
  "Cuidado del cabello y piel": [
    { id: "c1", nombre: "Champú Anticaspa", marca: "H&S", tipo: "Líquido", precio: 6.5 },
    { id: "c2", nombre: "Crema Hidratante", marca: "Nivea", tipo: "Crema", precio: 4.2 },
    { id: "c3", nombre: "Protector Solar", marca: "Isdin", tipo: "Crema", precio: 12.0 },
    { id: "c4", nombre: "Aloe Vera", marca: "Babaria", tipo: "Gel", precio: 5.0 },
    { id: "c5", nombre: "Aceite Capilar", marca: "Pantene", tipo: "Aceite", precio: 6.8 },
  ],
  "Salud bucal": [
    { id: "s1", nombre: "Pasta Dental", marca: "Colgate", tipo: "Crema", precio: 3.0 },
    { id: "s2", nombre: "Enjuague Bucal", marca: "Listerine", tipo: "Líquido", precio: 4.8 },
    { id: "s3", nombre: "Hilo Dental", marca: "Oral-B", tipo: "Rollo", precio: 2.5 },
    { id: "s4", nombre: "Cepillo Dental", marca: "Oral-B", tipo: "Manual", precio: 3.2 },
    { id: "s5", nombre: "Blanqueador Dental", marca: "Vitis", tipo: "Gel", precio: 7.0 },
  ],
  "Primeros auxilios": [
    { id: "p1", nombre: "Agua Oxigenada", marca: "Genérico", tipo: "Líquido", precio: 2.0 },
    { id: "p2", nombre: "Alcohol 70%", marca: "Acofar", tipo: "Líquido", precio: 2.8 },
    { id: "p3", nombre: "Vendas", marca: "Hansaplast", tipo: "Pack", precio: 3.5 },
    { id: "p4", nombre: "Tiritas", marca: "Hansaplast", tipo: "Pack", precio: 3.0 },
    { id: "p5", nombre: "Suero Fisiológico", marca: "Monodosis", tipo: "Ampolla", precio: 4.0 },
  ],
};

/* =======================
   COMPONENT
======================= */
export default function Hall() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [sinReceta, setSinReceta] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const handleRemoveProducto = (id: string) => {
    setSinReceta((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCategory = (categoria: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  const totalSinReceta = sinReceta.reduce(
    (total, item) => total + item.precio,
    0
  );

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: "https://via.placeholder.com/70" }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemText}>{item.marca}</Text>
        <Text style={styles.itemText}>{item.tipo}</Text>
        <Text style={styles.itemPrice}>{item.precio.toFixed(2)} €</Text>
      </View>
      <Pressable onPress={() => handleRemoveProducto(item.id)}>
        <MaterialIcons name="delete" size={22} color="#E63946" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* CON RECETA */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>CON RECETA</Text>
            <Text style={styles.subText}>¿Tienes receta?</Text>
          </View>
          <FlatList data={receta} renderItem={renderItem} />
        </View>

        {/* SIN RECETA */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>SIN RECETA</Text>
            <Pressable style={styles.filterButton} onPress={() => setShowDrawer(true)}>
              <MaterialIcons name="filter-list" size={18} color="#2DC653" />
              <Text style={styles.filterText}>Filtrar medicamentos</Text>
            </Pressable>
          </View>

          <FlatList data={sinReceta} renderItem={renderItem} />
          <Text style={styles.totalText}>Total: {totalSinReceta.toFixed(2)} €</Text>
        </View>

        {/* BOTÓN CANCELAR ABAJO */}
        <Pressable
          style={styles.cancelButtonScreen}
          onPress={() => router.replace("/screens/Home")}
        >
          <Text style={styles.cancelTextScreen}>Cancelar</Text>
        </Pressable>
      </ScrollView>

      {/* DRAWER */}
      <Modal visible={showDrawer} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowDrawer(false)}>
          <Pressable style={styles.drawer}>
            {/* BUSCADOR */}
            <TextInput
              placeholder="Buscar medicamento..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />

            <ScrollView>
              {Object.entries(medicamentosPorCategoria).map(([categoria, meds]) => {
                const filtrados = meds.filter((m) =>
                  m.nombre.toLowerCase().includes(search.toLowerCase())
                );
                if (filtrados.length === 0) return null;

                const isExpanded = expandedCategories[categoria];

                return (
                  <View key={categoria}>
                    {/* CATEGORIA */}
                    <Pressable
                      onPress={() => toggleCategory(categoria)}
                      style={styles.drawerCategoryButton}
                    >
                      <Text style={styles.drawerCategory}>{categoria}</Text>
                      <MaterialIcons
                        name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={20}
                        color="#5A189A"
                      />
                    </Pressable>

                    {/* MEDICAMENTOS EXPANDIDOS */}
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
                          <Text>{med.nombre}</Text>
                        </Pressable>
                      ))}
                  </View>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 16, elevation: 4 },
  cardHeader: { backgroundColor: "#5A189A", padding: 12 },
  cardHeaderRow: {
    backgroundColor: "#5A189A",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: { color: "#fff", fontWeight: "bold" },
  subText: { color: "#E0AAFF", fontSize: 12 },
  filterButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  filterText: { color: "#2DC653", fontWeight: "600" },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#F4F4F4",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  itemImage: { width: 70, height: 70, borderRadius: 8 },
  itemInfo: { marginLeft: 12, flex: 1 },
  itemName: { fontWeight: "bold" },
  itemText: { fontSize: 12, color: "#555" },
  itemPrice: { fontWeight: "bold" },
  totalText: { textAlign: "right", padding: 10, fontWeight: "bold", color: "#2DC653" },
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" },
  drawer: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  drawerCategoryButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 4,
  },
  drawerCategory: {
    fontWeight: "bold",
    color: "#5A189A",
  },
  drawerItem: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginBottom: 6,
    marginLeft: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  cancelButtonScreen: {
    marginVertical: 12,
    padding: 10,
    backgroundColor: "#E63946",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelTextScreen: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

