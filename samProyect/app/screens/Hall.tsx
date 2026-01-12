import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Modal,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Product {
  id: string;
  nombre: string;
  marca: string;
  tipo: string;
  precio: number;
}

const receta: Product[] = [
  {
    id: "1",
    nombre: "Medicamento A",
    marca: "Marca X",
    tipo: "Tabletas",
    precio: 5.0,
  },
];

const categorias = [
  "Analgésicos",
  "Alérgenos",
  "Gripe y resfriado",
  "Dieta y nutrición",
  "Cuidado de cabello y piel",
  "Salud bucal",
  "Primeros auxilios",
];

export default function Hall() {
  const [showFilter, setShowFilter] = useState(false);

  const [sinReceta, setSinReceta] = useState<Product[]>([
    {
      id: "2",
      nombre: "Medicamento B",
      marca: "Marca Y",
      tipo: "Jarabe",
      precio: 4.5,
    },
  ]);

  const handleAddCategoria = (categoria: string) => {
    const nuevoProducto: Product = {
      id: Date.now().toString(),
      nombre: categoria,
      marca: "Marca Y",
      tipo: "Jarabe",
      precio: 4.5,
    };

    setSinReceta((prev) => [...prev, nuevoProducto]);
    setShowFilter(false);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemCard}>
      <Image
        source={{ uri: "https://via.placeholder.com/70" }}
        style={styles.itemImage}
      />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemText}>{item.marca}</Text>
        <Text style={styles.itemText}>{item.tipo}</Text>
        <Text style={styles.itemPrice}>{item.precio.toFixed(2)} €</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>CON RECETA</Text>
          <Text style={styles.subText}>¿Tienes receta?</Text>
        </View>

        <FlatList
          data={receta}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>SIN RECETA</Text>

          <Pressable
            style={styles.filterButton}
            onPress={() => setShowFilter(true)}
          >
            <MaterialIcons name="filter-list" size={18} color="#2DC653" />
            <Text style={styles.filterText}>Filtrar medicamentos</Text>
          </Pressable>
        </View>

        <FlatList
          data={sinReceta}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>

      <Modal visible={showFilter} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.drawer}>
            <Text style={styles.drawerTitle}>FILTRAR MEDICAMENTOS</Text>

            {categorias.map((cat) => (
              <Pressable
                key={cat}
                style={styles.drawerItem}
                onPress={() => handleAddCategoria(cat)}
              >
                <Text>{cat}</Text>
              </Pressable>
            ))}

            <Pressable onPress={() => setShowFilter(false)}>
              <Text style={styles.close}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },

  cardHeader: {
    backgroundColor: "#5A189A",
    padding: 12,
  },

  cardHeaderRow: {
    backgroundColor: "#5A189A",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  subText: {
    color: "#E0AAFF",
    fontSize: 12,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  filterText: {
    color: "#2DC653",
    fontSize: 12,
    fontWeight: "600",
  },

  itemCard: {
    flexDirection: "row",
    backgroundColor: "#F4F4F4",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#DDD",
  },

  itemInfo: {
    marginLeft: 12,
  },

  itemName: {
    fontWeight: "bold",
    fontSize: 14,
  },

  itemText: {
    fontSize: 12,
    color: "#555",
  },

  itemPrice: {
    marginTop: 4,
    fontWeight: "bold",
    fontSize: 13,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  drawer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  drawerTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  drawerItem: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 8,
  },

  close: {
    textAlign: "center",
    marginTop: 12,
    fontWeight: "bold",
    color: "#7B2CBF",
  },
});