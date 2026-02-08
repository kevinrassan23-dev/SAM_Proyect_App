import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing(2),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },

    label: {
        fontSize: theme.fontSize.normal,
        fontWeight: "600",
        marginBottom: theme.spacing(1),
        color: theme.colors.primary,
    },

    input: {
        width: "100%",
        backgroundColor: theme.colors.background,
        borderWidth: 2,
        borderColor: theme.colors.success,
        borderRadius: 8,
        padding: theme.spacing(1.5),
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing(2),
    },

    button: {
        backgroundColor: theme.colors.secondary,
        flexDirection: "row",
        width: "80%",
        paddingVertical: theme.spacing(2),
        borderRadius: 30,
        marginBottom: theme.spacing(1),
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.normal,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },

    error: {
        color: theme.colors.error,
        fontSize: theme.fontSize.small,
        marginBottom: theme.spacing(1),
        textAlign: "center",
    },
});