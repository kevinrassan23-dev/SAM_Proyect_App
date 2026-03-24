import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/VerificacionChoiceStyle";

function VerificacionChoice() {
    const { cartilla } = useLocalSearchParams<{ cartilla: string }>();  


    const Contraseña = () => {
        router.push({ pathname: "/screens/VerificacionContrasena", params: { cartilla: cartilla }});
    }

    const Telefono = () => {
        router.push({ pathname: "/screens/VerificacionMovil", params: { cartilla: cartilla }});
    }

    const Volver = () => {
        router.push({ pathname: "/screens/Hall"});
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>¿Cómo desea autenticarse?</Text>

            <View style={styles.VerificacionChoiceContiner}>
                <Pressable style={styles.button} onPress={Contraseña}>
                    <Text style={styles.buttonText}>USAR MI CONTRASEÑA</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={Telefono}>
                    <Text style={styles.buttonText}>USAR MI TELÉFONO</Text>
                </Pressable>

                <Pressable style={styles.buttonVolver} onPress={Volver}>
                    <Text style={styles.buttonText}>VOLVER A LA TIENDA</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default VerificacionChoice;