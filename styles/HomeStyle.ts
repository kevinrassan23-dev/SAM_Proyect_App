import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing(2),
    },
    title: {
        fontSize: theme.fontSize.title,
        fontWeight: "bold",
        color: theme.colors.primary,
        marginBottom: theme.spacing(3),
    },

    image: {
        width: 300,
        height: 200,
        marginBottom: theme.spacing(3),
        resizeMode: "contain",
    },

    button: {
        backgroundColor: theme.colors.secondary,
        width: "100%",
        flexDirection: "row",
        paddingVertical: theme.spacing(2),
        borderRadius: 30,
        marginBottom: theme.spacing(2),
        alignItems: "center",
        justifyContent: "center",
        marginStart: "0%"
    },

    buttonText: {
        color: theme.colors.textSecondary,
        fontSize: 59,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 12,
        marginVertical: 16,
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
        marginBottom: 70
    },
    langButton: {
        width: 80,
        height: 80,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#e0e0e0",
        backgroundColor: "#f9f9f9",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    langButtonActive: {
        borderColor: "#4A90E2",
        backgroundColor: "#EBF3FD",
        shadowOpacity: 0.18,
        elevation: 6,
    },
    flag: {
        fontSize: 42,
    },
    activeDot: {
        position: "absolute",
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#4A90E2",
    },
});
