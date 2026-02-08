import { StyleSheet } from "react-native";
import theme from "../theme/Theme";
import VerificacionChoice from "@/app/screens/VerificacionChoice";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing(2),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
    },

    title: {
        fontSize: theme.fontSize.title,
        fontWeight: "bold",
        color: theme.colors.primary,
        marginVertical: theme.spacing(3),
        textAlign: "center",
    },

    button: {
        backgroundColor: theme.colors.secondary,
        width: "80%",
        flexDirection: "row",
        paddingVertical: theme.spacing(2),
        borderRadius: 30,
        marginBottom: theme.spacing(2),
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

    VerificacionChoiceContiner: {
        flexDirection: "column",
        gap: 16,
        justifyContent: "center",
        alignItems: "center",
    }
});