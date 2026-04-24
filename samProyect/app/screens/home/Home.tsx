import { styles } from "@/styles/screens/home/HomeStyle";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "@/language/config/ConfigIdiomas";
import { Image, Pressable, Text, View } from "react-native";

// Definición de idiomas disponibles con sus banderas
const LANGUAGES = [
  { code: "es", flag: "🇪🇸" },
  { code: "en", flag: "🇬🇧" },
  { code: "de", flag: "🇩🇪" },
  { code: "fr", flag: "🇫🇷" },
];

function Home() {
  // --- HOOKS Y ESTADO ---
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  // --- MANEJADORES ---
  /**
   * Cambia el idioma global de la app y actualiza el estado local
   */
  const handleLanguageChange = (code: string) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
  };

  // --- ESTRUCTURA DE INTERFAZ (UI) ---
  return (
    <View style={styles.container}>
      {/* Logotipo central de la aplicación */}
      <Image
        source={require("@/assets/images/sam_logo.png")}
        style={styles.image}
      />

      {/* Grilla de selección de idioma */}
      <View style={styles.grid}>
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.code;
          return (
            <Pressable
              key={lang.code}
              style={[
                styles.langButton, 
                isSelected && styles.langButtonActive
              ]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              {/* Punto indicador para el idioma activo */}
              {isSelected && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </View>

      {/* Botón de acceso a la identificación */}
      <Pressable
        style={styles.button}
        onPress={() => router.push("/screens/auth/IngresarCartilla")}
      >
        <Text style={styles.buttonText}>{t("Home.ACCEDER")}</Text>
      </Pressable>
    </View>
  );
}

export default Home;