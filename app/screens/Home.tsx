import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../../styles/HomeStyle";

const LANGUAGES = [
  { code: "ESP", flag: "🇪🇸" },
  { code: "ENG", flag: "🇬🇧" },
  { code: "ALE", flag: "🇩🇪" },
  { code: "FRA", flag: "🇫🇷" },
];

function Home() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleLanguageChange = (code: string) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
  };

  return (
    <View style={styles.container}>

      <Image
        source={require("../../assets/images/sam_logo.png")}
        style={styles.image}
      />

      <View style={styles.grid}>
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.code;
          return (
            <Pressable
              key={lang.code}
              style={[
                styles.langButton,
                isSelected && styles.langButtonActive,
              ]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              {isSelected && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </View>

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