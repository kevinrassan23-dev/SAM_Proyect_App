import { StyleSheet } from "react-native";
import theme from "@/theme/Theme";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: theme.spacing(3),
        paddingVertical: theme.spacing(4),
        backgroundColor: theme.colors.background,
    },
    mainContent: {
        flex: 1,
        // Añadimos un margen superior extra a todo el bloque de contenido
        marginTop: theme.spacing(4), 
    },
    headerSection: {
        // Aumentamos a 10 o 12 para bajarlo notablemente de la zona del logo
        marginTop: theme.spacing(16), 
        marginBottom: theme.spacing(1),
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
        // Aumentamos el espacio entre el título y la tarjeta
        marginTop: theme.spacing(4), 
        borderLeftWidth: 5,
        borderLeftColor: theme.colors.secondary, 
        elevation: 4, // Un poco más de sombra para que destaque al bajar
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    formSection: {
        width: "100%",
        // Más espacio entre la tarjeta de total y el input de monto
        marginTop: theme.spacing(6), 
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
    inputLabel: {
        fontSize: 20,
        color: theme.colors.textPrimary,
        fontWeight: "600",
        marginBottom: theme.spacing(1.5),
    },
    input: {
        backgroundColor: theme.colors.background,
        fontSize: 20,
        height: 70,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        width: "100%",
        flexDirection: "column",
        gap: theme.spacing(2),
        marginTop: 'auto', 
        paddingBottom: theme.spacing(4),
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
        elevation: 1,
    },
    buttonText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.normal,
        fontWeight: "700",
    },
    buttonTextSecondary: {
        color: theme.colors.background,
    },
});