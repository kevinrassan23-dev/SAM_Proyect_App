import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../styles/HomeStyle";

function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>

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
export default Home;