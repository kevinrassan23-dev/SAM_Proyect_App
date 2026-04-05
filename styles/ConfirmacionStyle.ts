import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing(2),
        backgroundColor: theme.colors.background,
        justifyContent: "center", 
    },


    titulo: {
        fontSize: theme.fontSize.title,
        fontWeight: "bold",
        color: theme.colors.primary,
        marginBottom: theme.spacing(2),
        textAlign: "center",
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.background,
        borderWidth: 2,
        borderColor: theme.colors.secondary,
        padding: theme.spacing(2),
        borderRadius: 12,
        marginBottom: theme.spacing(2),
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },

    box: {
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(4),
        borderRadius: 18,
        borderWidth: 2,
        borderColor: theme.colors.secondary,
        marginTop: theme.spacing(4),
        maxWidth: 340,
        alignSelf: "center",
    },
    scanner: {
        width: 110,
        height: 110,
        marginVertical: theme.spacing(2),
    },

    texto: {
        fontSize: theme.fontSize.large,
        color: theme.colors.secondary,
        marginBottom: theme.spacing(2),
        textAlign: "center",
        fontWeight: "600",
    },

    check: {
        fontSize: theme.fontSize.title,
        fontWeight: "bold",
        color: theme.colors.secondary,
        marginTop: theme.spacing(1),
    },

    content: {
        alignItems: "center",
    },
});