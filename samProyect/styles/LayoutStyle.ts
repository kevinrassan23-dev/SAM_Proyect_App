import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 40,
        right: 20,
        height: 60,                     
        width: "100%",
        backgroundColor: theme.colors.background,
        alignItems: "flex-end",         
        justifyContent: "center",       
        paddingRight: 10,               
        zIndex: 10,
    },

    logo: {
        width: 100,                     
        height: 60,                     
        resizeMode: "contain",
    },
});