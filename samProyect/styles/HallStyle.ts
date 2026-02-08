import { StyleSheet } from "react-native";
import theme from "../theme/Theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing(1.5),
        backgroundColor: "#fff",
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: theme.spacing(0.1),
        marginTop: theme.spacing(11.5),
        elevation: 4,
    },

    card2: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1.5),
        elevation: 4,
    },

    mediumText: {
        padding: 12,
        color: "#777",
    },

    cardHeader: {
        backgroundColor: theme.colors.secondary,
        padding: theme.spacing(1.5),
        borderRadius: 12,
    },

    flecha:{
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },

    cardHeaderRow: {
        backgroundColor: theme.colors.secondary,
        padding: theme.spacing(1.5),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 12,
    },

    cardTitle: {
        color: "#fff",
        fontWeight: "bold",
    },

    subText: {
        color: "#E0AAFF",
        fontSize: theme.fontSize.small,
    },

    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    filterText: {
        color: theme.colors.background,
        fontWeight: "600",
    },

    itemCard: {
        flexDirection: "row",
        backgroundColor: theme.colors.info,
        margin: theme.spacing(1.25),
        padding: theme.spacing(1.25),
        borderRadius: 10,
        alignItems: "center",
    },

    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },

    itemInfo: {
        marginLeft: theme.spacing(1.5),
        flex: 1,
    },

    itemName: {
        fontWeight: "bold",
    },

    itemText: {
        fontSize: theme.fontSize.small,
        color: "#555",
    },

    itemPrice: {
        fontWeight: "bold",
    },

    totalText: {
        textAlign: "right",
        padding: theme.spacing(1.25),
        fontWeight: "bold",
        color: theme.colors.success,
    },

    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },

    drawer: {
        backgroundColor: "#fff",
        padding: theme.spacing(1.5),
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: "80%",
    },

    drawerCategoryButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: theme.spacing(0.75),
        paddingHorizontal: theme.spacing(0.5),
        backgroundColor: theme.colors.success,
        borderRadius: 6,
        marginBottom: theme.spacing(0.5),
    },

    drawerCategory: {
        fontWeight: "bold",
        color: theme.colors.background,
    },

    drawerItem: {
        padding: theme.spacing(1.25),
        backgroundColor: theme.colors.info,
        borderRadius: 6,
        marginBottom: theme.spacing(0.75),
        marginLeft: theme.spacing(1.5),
    },

    searchInput: {
        borderWidth: 1,
        borderColor: theme.colors.success,
        borderRadius: 8,
        paddingHorizontal: theme.spacing(1.25),
        paddingVertical: theme.spacing(0.75),
        marginBottom: theme.spacing(1.5),
    },

    cancelButtonScreen: {
        marginVertical: theme.spacing(1.5),
        padding: theme.spacing(1.25),
        backgroundColor: theme.colors.error,
        borderRadius: 8,
        alignItems: "center",
    },

    cancelTextScreen: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: theme.fontSize.normal,
    },

    bottomButtons: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "110%", 
        flexDirection: "column",
        justifyContent: "space-around",
        paddingVertical: 30,
        backgroundColor: "#fff",    
        borderTopWidth: 3,
        borderTopColor: "#ddd",
    },

    bottomButton: {
        flex: 1,
        marginHorizontal: 30,
        marginVertical: 8,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.secondary,
        bottom: 20,
        
    },

    bottomButtonVolver: {
        flex: 1,
        marginHorizontal: 30,
        marginVertical: 8,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#d82215",
        bottom: 20,
        
    },


    bottomButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
