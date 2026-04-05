// styles/PagoEfectivoStyle.ts (o el nombre que corresponda)
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
    headerSection: {
        marginBottom: theme.spacing(2),
    },
    titleText: {
        fontSize: theme.fontSize.title,
        color: theme.colors.primary,
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: -0.5,
    },
    totalCard: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: theme.spacing(3.5),
        marginBottom: theme.spacing(4),
        borderLeftWidth: 5,
        borderLeftColor: theme.colors.primary,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        width: "80%",
    },
    totalLabel: {
        fontSize: theme.fontSize.small,
        color: "#888",
        marginBottom: theme.spacing(1),
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    totalAmount: {
        fontSize: 32,
        color: theme.colors.primary,
        fontWeight: "700",
    },
    formSection: {
        width: "80%",
        marginBottom: theme.spacing(3),
    },
    inputLabel: {
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary,
        fontWeight: "600",
        marginBottom: theme.spacing(1.5),
    },
    input: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: theme.colors.success,
        borderRadius: 8,
        paddingHorizontal: theme.spacing(2),
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing(2),
    },
    buttonsContainer: {
        flexDirection: "column",
        gap: theme.spacing(2),
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
    },
    button: {
        backgroundColor: theme.colors.secondary,
        width: "100%",
        paddingVertical: theme.spacing(2),
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonSecondary: {
        backgroundColor: theme.colors.error,
    },
    buttonText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.large,
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonTextSecondary: {
        color: theme.colors.textSecondary,
    },
    Outline: {
        color: theme.colors.primary
    },
});