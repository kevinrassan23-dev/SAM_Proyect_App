import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import customTheme from "../theme/Theme";

function Home() {

    const FormaPago = () => {
        router.push({ pathname: "/screens/FormaPago"});
    }

    const VerificationChoice = () => {
        router.push({ pathname: "/screens/VerificacionChoice"});
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Home</Text>

            <View style={{ flexDirection: 'column', gap: customTheme.spacing(2), justifyContent: "center", alignItems: "center", }}>
                <Pressable style={styles.button} onPress={FormaPago}>
                    <Text style={styles.buttonText}>FormaPago</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={VerificationChoice}>
                    <Text style={styles.buttonText}>VerificationChoice</Text>
                </Pressable>
            </View>
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

    button: {
        backgroundColor: customTheme.colors.secondary,
        width: "80%",
        flexDirection: "row",
        paddingVertical: customTheme.spacing(2),
        borderRadius: 10,
        marginBottom: customTheme.spacing(2),
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: customTheme.colors.textSecondary,
        fontSize: customTheme.fontSize.large,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
});

export default Home;