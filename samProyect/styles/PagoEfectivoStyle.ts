import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing(2.5),
        justifyContent: "center",
        backgroundColor: theme.colors.background,
    },

    MainText: {
        fontSize: theme.fontSize.large,
        color: theme.colors.primary,
        fontWeight: "bold",
        marginBottom: theme.spacing(2.5),
        textAlign: "center",
    },

    input: {
        width: "100%",
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.success,
        borderRadius: 8,
        // ESTO
        padding: theme.spacing(0.2),
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary, 
        marginBottom: theme.spacing(2),
    },

    button: {
        backgroundColor: theme.colors.secondary,
        width: "100%",
        paddingVertical: theme.spacing(1.5),
        borderRadius: 30,
        marginBottom: theme.spacing(2),
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
    },

    buttonText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.normal,
        fontWeight: "bold",
    },

    Outline: {
        color: theme.colors.primary
    },
});