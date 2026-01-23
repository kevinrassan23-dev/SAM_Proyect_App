import React from "react";
import { StyleSheet, Text, View } from "react-native";
import customTheme from "../theme/Theme";

function Hall() {

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Hall</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: customTheme.spacing(2),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: customTheme.colors.background,
    },
    title: {
        fontSize: customTheme.fontSize.title,
        fontWeight: "bold",
        color: customTheme.colors.primary,
        marginVertical: customTheme.spacing(3),
        textAlign: "center",
    },
});

export default Hall;