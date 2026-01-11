import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../theme/Theme";
import React from "react";

const { width } = Dimensions.get("window");

export default function Menu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const positionX = useState(new Animated.Value(-width))[0];

  const abrirMenu = () => {
    setOpen(true);
    Animated.timing(positionX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const cerrarMenu = () => {
    Animated.timing(positionX, {
      toValue: -width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={abrirMenu}>
          <MaterialIcons name="menu" size={25} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {open && <TouchableOpacity style={styles.overlay} onPress={cerrarMenu} activeOpacity={1} />}

      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: positionX }], display: open ? "flex" : "none" },
        ]}
      >
        <Text style={styles.drawerTitle}>Menú</Text>

        <View style={styles.itemsContainer}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              cerrarMenu();
              router.push("./home");
            }}
          >
            <MaterialIcons name="home" size={24} color={theme.colors.primary} />
            <Text style={styles.drawerText}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              cerrarMenu();
              router.push("./hall");
            }}
          >
            <MaterialIcons name="meeting-room" size={24} color={theme.colors.primary} />
            <Text style={styles.drawerText}>Hall</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    zIndex: 1000,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000066",
    zIndex: 998,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.6,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
    paddingHorizontal: theme.spacing(2),
    zIndex: 999,
    elevation: 10,
  },
  drawerTitle: {
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
    marginBottom: theme.spacing(3),
    color: theme.colors.primary,
    paddingBottom: theme.spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  itemsContainer: {
    flexDirection: "column",
    gap: 20,
    alignItems: "flex-start",
    width: "100%",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing(1),
    width: "100%",
  },
  drawerText: {
    marginLeft: 15,
    fontSize: theme.fontSize.normal,
    color: theme.colors.primary,
    fontWeight: "500",
  },
});