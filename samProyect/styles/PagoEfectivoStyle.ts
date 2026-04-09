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
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#16C17220",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing(1),
    },
    inputLabel: {
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary + "CC",
        marginBottom: theme.spacing(1),
    },
    input: {
        width: "80%",
        fontSize: theme.fontSize.large,
        fontWeight: "bold",
        textAlign: "center",
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 12,
        paddingVertical: theme.spacing(1.5),
        paddingHorizontal: theme.spacing(2),
        color: theme.colors.textPrimary,
        backgroundColor: theme.colors.background,
    },
    acceptBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing(1.5),
        paddingHorizontal: theme.spacing(3),
        borderRadius: 30,
        marginTop: theme.spacing(1),
        elevation: 4,
    },
    acceptBtnText: {
        color: "#fff",
        fontSize: theme.fontSize.normal,
        fontWeight: "bold",
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
