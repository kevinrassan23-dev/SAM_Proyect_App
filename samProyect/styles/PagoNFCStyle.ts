import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing(2.5),
        justifyContent: "center",
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

    content: {
        flex: 1,
        padding: theme.spacing(2.5),
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

    MainText: {
        fontSize: theme.fontSize.large,
        color: theme.colors.primary,
        fontWeight: "bold",
        marginBottom: theme.spacing(4),
        textAlign: "center",
    },

    instructionText: {
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary,
        textAlign: "center",
        marginBottom: theme.spacing(4),
    },

    successText: {
        fontSize: theme.fontSize.title,
        color: theme.colors.primary,
        fontWeight: "bold",
        marginTop: theme.spacing(2),
        textAlign: "center",
    },

    redirectText: {
        fontSize: theme.fontSize.small,
        color: "#666",
        marginTop: theme.spacing(1),
        textAlign: "center",
    },

    imagePlaceholder: {
        width: 200,
        height: 200,
        backgroundColor: "#f0f0f0",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: theme.spacing(4),
        borderColor: theme.colors.primary,
        borderStyle: "dashed",
    },

    placeholderText: {
        color: "#999",
        fontSize: 12,
        textAlign: "center",
    },

    buttons: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
    },

    button: {
        width: "100%",
        marginVertical: theme.spacing(0.75),
    },
});