import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../../styles/HomeStyle";

function Home() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => i18n.changeLanguage("ESP")}
      >
        <Text style={styles.buttonText}>ESP</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => i18n.changeLanguage("ENG")}
      >
        <Text style={styles.buttonText}>ENG</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => i18n.changeLanguage("ALE")}
      >
        <Text style={styles.buttonText}>ALE</Text>
      </Pressable>


      <Image
        source={require("../../assets/images/sam_logo.png")}
        style={styles.image}
      />

      <Pressable
        style={styles.button}
        onPress={() => router.push("/screens/Hall")}
      >
        <Text style={styles.buttonText}>{t("Home.ACCEDER")}</Text>
      </Pressable>
    </View>
  );
}
export default Home;