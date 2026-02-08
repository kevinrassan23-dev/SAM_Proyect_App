import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/VerificacionChoiceStyle";

function VerificacionChoice() {

    const DNI = () => {
        router.push({ pathname: "/screens/VerificacionDNI"});
    }

    const Teléfono = () => {
        router.push({ pathname: "/screens/VerificacionMovil"});
    }

    const Volver = () => {
        router.push({ pathname: "/screens/Hall"});
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>¿COMO DESEA VERIFICARSE?</Text>

            <View style={styles.VerificacionChoiceContiner}>
                <Pressable style={styles.button} onPress={DNI}>
                    <Text style={styles.buttonText}>USAR DNI</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={Teléfono}>
                    <Text style={styles.buttonText}>USAR TELÉFONO</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={Volver}>
                    <Text style={styles.buttonText}>VOLVER A LA TIENDA</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default VerificacionChoice;