import React from "react";
import { Stack, usePathname } from "expo-router";
import { View, Image } from "react-native";
import { styles } from "../styles/LayoutStyle";

const SAM_LOGO = require("../assets/images/sam_logo.png");

// HEADER APP BAR 
function RootLayout() {

    const pathname = usePathname();

    // Ocultar logo SOLO en Home
    const hideHeader = pathname === "/screens/Home" || pathname === "/";

    return (
        <>
            <Stack screenOptions={{ headerShown: false }} />

            {/* Ocultamos la app bar solo para /Home ya que es la única 
                que lleva el logo de presentación.
            */}
            {!hideHeader && (
                <View style={styles.header}>
                    <Image source={SAM_LOGO} style={styles.logo} />
                </View>
            )}
        </>
    );
}

export default RootLayout;