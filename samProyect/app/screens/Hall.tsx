import React, { useState } from "react";
import { View, Text, Pressable, FlatList, 
        Modal, Image, ScrollView, TextInput, 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "../../styles/HallStyle";

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

// POR AHORA FORZAMOS LOS MEDICAMENTOS, CUANDO REALICEMOS EL BACKEND, LOS MEDICAMENTOS QUE SE 
// MOSTRARÁN SERÁN LOS QUE ESTARÁN EN LA BASE DE DATOS 
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
function Hall() {
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

              {receta.length === 0 && (
                <Text style={styles.mediumText}>
                  No hay productos con receta disponibles
                </Text>
              )}
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
        <Pressable style={styles.bottomButton} onPress={() => router.push("/screens/FormaPago")}>
            <Text style={styles.bottomButtonText}>COMPRAR</Text>
        </Pressable>

        <Pressable style={styles.bottomButtonVolver} onPress={() => router.push("/screens/Home")}>
            <Text style={styles.bottomButtonText}>CANCELAR</Text>
        </Pressable>
      </View>

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
                        color="#ffffff"
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
                          <Text style={styles.drawerItem}>{med.nombre}</Text>
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

export default Hall;