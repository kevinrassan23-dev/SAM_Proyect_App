import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing(3),
        paddingVertical: theme.spacing(4),
        justifyContent: "space-between",
        backgroundColor: theme.colors.background,
    },

    headerSection: {
        marginBottom: theme.spacing(4),
    },

    titleText: {
        fontSize: 32,
        color: theme.colors.primary,
        fontWeight: "800",
        marginBottom: theme.spacing(3),
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
        flex: 1,
        justifyContent: "center",
        marginBottom: theme.spacing(4),
    },

    inputLabel: {
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary,
        fontWeight: "600",
        marginBottom: theme.spacing(1.5),
    },

    input: {
        backgroundColor: "#ffffff",
        borderWidth: 1.5,
        borderColor: "#d0d0d0",
        borderRadius: 14,
        paddingHorizontal: theme.spacing(2.5),
        paddingVertical: theme.spacing(2.5),
        fontSize: 20,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing(4),
        fontWeight: "500",
        letterSpacing: 5,
    },

    buttonsContainer: {
        gap: theme.spacing(2),
    },

    button: {
        backgroundColor: theme.colors.secondary,
        width: "100%",
        paddingVertical: theme.spacing(2.25),
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 5,
    },

    buttonSecondary: {
        backgroundColor: "#f0f0f0",
        elevation: 2,
        shadowOpacity: 0.08,
    },

    buttonText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.normal,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

    buttonTextSecondary: {
        color: theme.colors.primary,
    }
});