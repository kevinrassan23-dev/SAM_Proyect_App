import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Menu from "../components/Menu";
import theme from "../theme/Theme";

export default function Home() {
  return (
    <View style={styles.container}>
      <Menu />
      <Text style={styles.title}>Bienvenido a Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});