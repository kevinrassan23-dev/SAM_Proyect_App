import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
<<<<<<< HEAD
        padding: theme.spacing(2),
        justifyContent: "center",
        alignItems: "center",
=======
        paddingHorizontal: theme.spacing(3),
        paddingVertical: theme.spacing(4),
        justifyContent: "space-between",
>>>>>>> cfc6748d6f7a3d8491abbaaa595b70b1e527d357
        backgroundColor: theme.colors.background,
    },

    headerSection: {
<<<<<<< HEAD
        marginBottom: theme.spacing(2),
    },

    titleText: {
        fontSize: theme.fontSize.title,
        color: theme.colors.primary,
        fontWeight: "bold",
=======
        marginBottom: theme.spacing(4),
    },

    titleText: {
        fontSize: 32,
        color: theme.colors.primary,
        fontWeight: "800",
        marginBottom: theme.spacing(3),
>>>>>>> cfc6748d6f7a3d8491abbaaa595b70b1e527d357
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

    totalCard: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: theme.spacing(2),
        marginBottom: theme.spacing(3),
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.secondary,
        width: "80%",
    },

    totalLabel: {
        fontSize: theme.fontSize.small,
        color: "#666",
        marginBottom: theme.spacing(1),
        fontWeight: "600",
    },

    totalAmount: {
        fontSize: 28,
        color: theme.colors.secondary,
        fontWeight: "bold",
    },

    formSection: {
        width: "80%",
        marginBottom: theme.spacing(3),
    },

    inputLabel: {
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary,
        fontWeight: "600",
        marginBottom: theme.spacing(1),
    },

    input: {
<<<<<<< HEAD
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: theme.colors.success,
        borderRadius: 8,
        paddingHorizontal: theme.spacing(2),
        fontSize: theme.fontSize.normal,
=======
        backgroundColor: "#ffffff",
        borderWidth: 1.5,
        borderColor: "#d0d0d0",
        borderRadius: 14,
        paddingHorizontal: theme.spacing(2.5),
        paddingVertical: theme.spacing(2.5),
        fontSize: 20,
>>>>>>> cfc6748d6f7a3d8491abbaaa595b70b1e527d357
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing(4),
        fontWeight: "500",
        letterSpacing: 5,
    },

    buttonsContainer: {
        gap: theme.spacing(2),
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
<<<<<<< HEAD
        paddingVertical: theme.spacing(2),
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonSecondary: {
        backgroundColor: theme.colors.error,
=======
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
>>>>>>> cfc6748d6f7a3d8491abbaaa595b70b1e527d357
    },

    buttonText: {
        color: theme.colors.textSecondary,
<<<<<<< HEAD
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
=======
        fontSize: theme.fontSize.normal,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

    buttonTextSecondary: {
        color: theme.colors.primary,
    }
>>>>>>> cfc6748d6f7a3d8491abbaaa595b70b1e527d357
});