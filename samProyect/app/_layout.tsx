import React from "react";
import { Stack, usePathname } from "expo-router";
import { View, Image } from "react-native";
import { styles } from "@/styles/screens/common/LayoutStyle";

function RootLayout() {
  // --- CONFIGURACIÓN ---
  const SAM_LOGO = require("@/assets/images/sam_logo.png");
  const pathname = usePathname();

  // Ocultar la cabecera en la pantalla de inicio para no duplicar el logo central
  const hideHeader = pathname === "/screens/home/Home" || pathname === "/";

  return (
    <>
      {/* Definición del stack de navegación */}
      <Stack screenOptions={{ headerShown: false }} />

      {/* App Bar global con logo de SAM */}
      {!hideHeader && (
        <View style={styles.header}>
          <Image source={SAM_LOGO} style={styles.logo} />
        </View>
      )}
    </>
  );
}

export default RootLayout;