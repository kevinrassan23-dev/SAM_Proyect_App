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
        marginTop: theme.spacing(16), 
        marginBottom: theme.spacing(2),
        alignItems: 'center',
    },
    headerSectionSuccess: {
        marginTop: theme.spacing(20), 
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
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    totalCard: {
        width: '100%',
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: theme.spacing(3.5),
        marginTop: theme.spacing(6), 
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
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
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
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing(2.25),
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.secondary,
    },
    buttonScan: {
        backgroundColor: theme.colors.success,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: theme.fontSize.normal,
        fontWeight: "700",
    },
    buttonTextSecondary: {
        color: "#ffffff",
    },
    instructionText: {
        fontSize: 20,
        color: theme.colors.textPrimary,
        textAlign: "center",
        marginTop: 20,
        fontWeight: "600",
        paddingHorizontal: 20,
    },
    successHeaderSection: {
        marginBottom: theme.spacing(1),
    },
    successContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: theme.spacing(2),
        marginBottom: theme.spacing(12),
    },
    successTitle: {
        fontSize: 28,
        color: theme.colors.primary,
        fontWeight: "700",
        marginTop: theme.spacing(4),
        textAlign: "center",
    },
});