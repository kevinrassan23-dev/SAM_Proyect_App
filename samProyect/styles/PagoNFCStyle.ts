import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing(2),
        backgroundColor: theme.colors.background,
    },
    header: {
        marginBottom: theme.spacing(2),
    },
    title: {
        fontSize: theme.fontSize.title,
        fontWeight: "bold",
        color: theme.colors.primary,
        textAlign: "center",
    },
    totalContainer: {
        marginTop: theme.spacing(2),
        flexDirection: "row",
        justifyContent: "space-between",
        padding: theme.spacing(2),
        borderWidth: 2,
        borderColor: theme.colors.secondary,
        borderRadius: 12,
    },
    totalLabel: {
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary + "CC",
    },
    totalAmount: {
        fontSize: theme.fontSize.large,
        fontWeight: "bold",
        color: theme.colors.textPrimary,
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing(2),
    },
    iconCircle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#9525D720",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing(1),
    },
    successCircle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#16C17220",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing(1),
    },
    instructionText: {
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary + "CC",
        textAlign: "center",
        maxWidth: 280,
    },
    scanBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: theme.colors.secondary,
        paddingVertical: theme.spacing(1.5),
        paddingHorizontal: theme.spacing(3),
        borderRadius: 30,
        marginTop: theme.spacing(1),
        elevation: 4,
    },
    scanBtnText: {
        color: "#fff",
        fontSize: theme.fontSize.normal,
        fontWeight: "bold",
    },
    successText: {
        fontSize: theme.fontSize.title,
        fontWeight: "bold",
        color: theme.colors.primary,
    },
    redirectText: {
        fontSize: theme.fontSize.small,
        color: theme.colors.textPrimary + "99",
    },
    secondaryButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "auto",
    },
    secondaryBtn: {
        flexDirection: "row",
        alignItems: "center",
        padding: theme.spacing(2),
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.secondary,
    },
    cancelBtn: {
        borderColor: theme.colors.error,
    },
    secondaryBtnText: {
        marginLeft: theme.spacing(1),
        color: theme.colors.textPrimary,
    },
    cancelText: {
        color: theme.colors.error,
    },
});