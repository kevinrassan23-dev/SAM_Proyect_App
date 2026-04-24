import { StyleSheet } from "react-native";
import theme from "@/theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing(3),
        backgroundColor: theme.colors.background,
    },
    mainContent: {
        flex: 1,
    },
    headerSection: {
        marginTop: theme.spacing(15), 
        marginBottom: theme.spacing(2),
        alignItems: 'center',
    },
    titleText: {
        fontSize: 32,
        color: theme.colors.primary,
        fontWeight: "800",
        textAlign: "center",
        letterSpacing: -0.5,
    },
    totalCard: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: theme.spacing(3.5),
        marginTop: theme.spacing(4), 
        borderLeftWidth: 5,
        borderLeftColor: theme.colors.secondary, 
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        fontSize: 36,
        color: theme.colors.secondary,
        fontWeight: "700",
    },
    formSection: {
        width: "100%",
        marginTop: theme.spacing(8), 
    },
    inputLabel: {
        fontSize: 20,
        color: theme.colors.textPrimary,
        fontWeight: "600",
        marginBottom: theme.spacing(2),
        textAlign: 'center',
    },
    input: {
        backgroundColor: theme.colors.background,
        fontSize: 28, 
        height: 75,
    },
    inputContent: {
        paddingHorizontal: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    outlineStyle: {
        borderRadius: 12,
        borderWidth: 2,
    },
    buttonsContainer: {
        width: "100%",
        flexDirection: "column",
        gap: theme.spacing(2), 
        marginTop: 'auto', 
        paddingBottom: theme.spacing(6),
    },
    button: {
        width: "100%",
        backgroundColor: theme.colors.secondary,
        paddingVertical: theme.spacing(2.25),
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.error,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: theme.fontSize.normal,
        fontWeight: "700",
    },
    buttonTextSecondary: {
        color: "#ffffff",
    },
});