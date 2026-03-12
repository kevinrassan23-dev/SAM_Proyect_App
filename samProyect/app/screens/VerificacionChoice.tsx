import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/VerificacionChoiceStyle";

function VerificacionChoice() {
    const { cartilla } = useLocalSearchParams<{ cartilla: string }>();  


    const Contraseña = () => {
        router.push({ pathname: "/screens/VerificacionContraseña", params: { cartilla: cartilla }});
    }

    const Teléfono = () => {
        router.push({ pathname: "/screens/VerificacionMovil", params: { cartilla: cartilla }});
    }

    const Volver = () => {
        router.push({ pathname: "/screens/Hall"});
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>¿COMO DESEA VERIFICARSE?</Text>

            <View style={styles.VerificacionChoiceContiner}>
                <Pressable style={styles.button} onPress={Contraseña}>
                    <Text style={styles.buttonText}>USAR CONTRASEÑA</Text>
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