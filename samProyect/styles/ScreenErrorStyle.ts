import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing(3),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },

    lottie: {
        width: 400,
        height: 400,
        marginBottom: theme.spacing(2),
    },

    codigo: {
        fontSize: theme.fontSize.large,
        fontWeight: "bold",
        color: theme.colors.error,
        marginBottom: theme.spacing(1),
    },

    mensaje: {
        fontSize: theme.fontSize.normal,
        textAlign: "center",
        marginBottom: theme.spacing(1),
    },

    ref: {
        fontSize: theme.fontSize.small,
        color: theme.colors.info,
        marginBottom: theme.spacing(3),
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
});