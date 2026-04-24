import { StyleSheet } from "react-native";
import theme from "@/theme/Theme";

export const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 0, 
        left: 0,
        right: 0,
        height: 90, 
        backgroundColor: theme.colors.background, 
        flexDirection: "row", 
        alignItems: "flex-end", 
        justifyContent: "flex-end", 
        paddingRight: 20,

        paddingBottom: 8, 
        zIndex: 1000,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    logo: {
        width: 90,
        height: 42,
        resizeMode: "contain",
    },
});