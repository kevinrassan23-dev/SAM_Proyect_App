import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import Menu from "../components/Menu";
import theme from "../theme/Theme";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Menu />      

      <Image
        source={require("../../assets/images/sam_logo.png")}
        style={styles.image}
      />

      <Pressable
        style={styles.button}
        onPress={() => router.push("/screens/Hall")}
      >
        <Text style={styles.buttonText}>ACCEDER</Text>
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
  image: {
    width: 500,        
    height: 500,      
    marginBottom: 20,
    resizeMode: "contain",
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
