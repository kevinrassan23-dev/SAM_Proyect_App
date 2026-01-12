import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Menu from "../components/Menu";
import theme from "../theme/Theme";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Menu />

      <Text style={styles.title}>Acceder</Text>

      {/* BOTÓN A HALL */}
      <Pressable
        style={styles.button}
        onPress={() => router.push("/screens/Hall")}
      >
        <Text style={styles.buttonText}>Ir a Hall</Text>
      </Pressable>
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
    marginBottom: 20,
  },

  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});