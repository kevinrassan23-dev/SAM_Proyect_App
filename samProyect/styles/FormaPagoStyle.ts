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

    separator: {
        height: 1,
        backgroundColor: theme.colors.secondary,
        marginVertical: theme.spacing(2),
    },

    cardsContainer: {
        gap: theme.spacing(2),
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: theme.spacing(2),
        borderRadius: 12,
        borderWidth: 2,
        backgroundColor: theme.colors.background,
    },

    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },

    cardTextContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },

    cardTitle: {
        fontSize: theme.fontSize.large,
        fontWeight: "bold",
        color: theme.colors.textPrimary,
    },

    cardDescription: {
        fontSize: theme.fontSize.normal,
        color: theme.colors.textPrimary + "CC",
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

    row: {
    flexDirection: "row",
    gap: 16,
    marginTop: 30,
},

cardFilled: {
    flex: 1,
    height: 220,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
},

cardFilledText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
},

centerContent: {
    flex: 1,
    justifyContent: "center",
},

});