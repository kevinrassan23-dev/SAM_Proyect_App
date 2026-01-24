import React from "react";
import { Stack, usePathname } from "expo-router";
import { View, Image, StyleSheet } from "react-native";
import customTheme from "./theme/Theme";

const SAM_LOGO = require("./assets/images/sam_logo.png");

const pathname = usePathname();

// Ocultar logo SOLO en Home
const hideHeader = pathname === "/screens/Home" || pathname === "/";

// HEADER APP BAR 
function RootLayout() {
    return (
        <>
            {/* Ocultamos la app bar solo para /Home ya que es la única 
                que lleva el logo de presentación.
            */}
            {!hideHeader && (
                <View style={styles.header}>
                    <Image source={SAM_LOGO} style={styles.logo} />
                </View>
            )}

            <Stack screenOptions={{ headerShown: false }} />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 0,
        right: 0,
        height: 100,                     
        width: "100%",
        backgroundColor: customTheme.colors.background,
        alignItems: "flex-end",          
        justifyContent: "center",
        paddingRight: 20, 
        zIndex: 10,               
    },

    logo: {
        width: 220,                      
        height: 80,
        resizeMode: "contain",
    },
});

export default RootLayout;