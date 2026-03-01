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

    logoContainer: {
        alignItems: "flex-end",
        paddingHorizontal: theme.spacing(2.5),
        paddingTop: theme.spacing(2),
        width: "100%",
    },

    logo: {
        width: 120,
        height: 60,
        resizeMode: "contain",
    },

    headerSection: {
        marginBottom: theme.spacing(1),
    },

    content: {
        flex: 1,
        paddingHorizontal: theme.spacing(2),
        justifyContent: "center",
    },

    successContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
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

    instructionText: {
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary,
        textAlign: "center",
        marginBottom: theme.spacing(4),
        fontWeight: "600",
        lineHeight: 26,
    },

    successText: {
        fontSize: 28,
        color: theme.colors.primary,
        fontWeight: "700",
        marginTop: theme.spacing(4),
        textAlign: "center",
    },

    redirectText: {
        fontSize: theme.fontSize.normal,
        color: "#999",
        marginTop: theme.spacing(2),
        textAlign: "center",
        fontWeight: "500",
    },

    imagePlaceholder: {
        width: 220,
        height: 220,
        backgroundColor: "transparent",
        borderRadius: 120,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: theme.spacing(4),
        elevation: 0,
        shadowColor: "transparent",
    },

    placeholderText: {
        color: "#999",
        fontSize: 12,
        textAlign: "center",
    },

    buttons: {
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: theme.spacing(2.5),
    },

    button: {
        width: "100%",
        backgroundColor: theme.colors.secondary,
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
    },
});