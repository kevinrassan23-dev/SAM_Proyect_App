import React, { useState } from "react";
import {View,Text,StyleSheet,Pressable,FlatList,Modal,} from "react-native";

interface Product {
  id: string;
  name: string;
  price: number;
}

const receta: Product[] = [
  { id: "1", name: "Nombre", price: 3.5 },
  { id: "2", name: "Nombre", price: 5.2 },
];

const tienda: Product[] = [
  { id: "3", name: "Nombre", price: 2.1 },
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

  const total =
    receta.reduce((acc, p) => acc + p.price, 0) +
    tienda.reduce((acc, p) => acc + p.price, 0);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.row}>
      <Text>{item.name}</Text>
      <Text>{item.price.toFixed(2)} €</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      //Con Receta
      <Text style={styles.section}>CON RECETA</Text>
      <FlatList
        data={receta}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      //Sin receta/Tienda
      <Text style={styles.section}>TIENDA</Text>
      <FlatList
        data={tienda}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      //Total
      <Text style={styles.total}>TOTAL: {total.toFixed(2)} €</Text>

      //Todos los botones
      <Pressable style={styles.buy}>
        <Text style={styles.buttonText}>COMPRAR</Text>
      </Pressable>

      <Pressable style={styles.cancel}>
        <Text style={styles.buttonText}>CANCELAR COMPRA</Text>
      </Pressable>

      <Pressable onPress={() => setShowFilter(true)}>
        <Text style={styles.filter}>Filtrar medicamentos</Text>
      </Pressable>

      //Drawer y Filtro
      <Modal visible={showFilter} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.drawer}>
            <Text style={styles.drawerTitle}>FILTRAR MEDICAMENTOS</Text>

            {categorias.map((cat) => (
              <Pressable key={cat} style={styles.drawerItem}>
                <Text>{cat}</Text>
              </Pressable>
            ))}

            <Pressable onPress={() => setShowFilter(false)}>
              <Text style={styles.close}>X</Text>
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
  },

  section: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 6,
  },

  total: {
    fontWeight: "bold",
    marginVertical: 16,
    fontSize: 16,
  },

  buy: {
    backgroundColor: "#7B2CBF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },

  cancel: {
    backgroundColor: "#9D4EDD",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  filter: {
    textAlign: "center",
    color: "#7B2CBF",
    fontWeight: "bold",
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
  },
});
