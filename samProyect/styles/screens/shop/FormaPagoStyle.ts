import { StyleSheet } from "react-native";
import theme from "@/theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing(2),
        backgroundColor: theme.colors.background,
        justifyContent: "center",  // ✅ CAMBIO: center para centrar todo
        alignItems: "center",
    },
    title: {
        fontSize: theme.fontSize.title,
        fontWeight: "bold",
        color: theme.colors.primary,
        marginBottom: theme.spacing(3),  // ✅ CAMBIO: marginBottom en lugar de marginVertical
        textAlign: "center",
    },
    button: {
        backgroundColor: theme.colors.secondary,
        width: "80%",
        flexDirection: "row",
        paddingVertical: theme.spacing(2),
        borderRadius: 30,
        marginBottom: theme.spacing(1),
        alignItems: "center",
        justifyContent: "center",
    },

    buttonVolver: {
        backgroundColor: "#d82215",
        width: "80%",
        flexDirection: "row",
        paddingVertical: theme.spacing(2),
        borderRadius: 30,
        marginBottom: theme.spacing(1),
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

    formaPagoContainer: {
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",  // ✅ CAMBIO: center en lugar de flex-start
        alignItems: "center",
        width: "100%",
    }
});