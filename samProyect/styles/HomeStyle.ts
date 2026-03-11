import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing(2),
    },
    title: {
        fontSize: theme.fontSize.title,
        fontWeight: "bold",
        color: theme.colors.primary,
        marginBottom: theme.spacing(3),
    },

    image: {
        width: 300,      
        height: 200,
        marginBottom: theme.spacing(3),
        resizeMode: "contain",
    },

    button: {
        backgroundColor: theme.colors.secondary,
        width: "80%",
        flexDirection: "row",
        paddingVertical: theme.spacing(2),
        borderRadius: 30,
        marginBottom: theme.spacing(2),
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.large,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
});
