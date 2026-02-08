import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { styles } from "../../styles/VerificacionMovilStyle";

function VerificacionMovil() {
    const [CODIGO, SETCODIGO] = useState({
        Codigo: '',
    });

    const cambios = (e: any) => {
        SETCODIGO(CODIGO => ({
            ...CODIGO,
            Codigo: e
        }));
    }

    const aceptar = () => {
        router.push("/screens/Hall")
    }

    const volver = () => {
        router.push("/screens/VerificacionChoice")
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>INGRESE EL CODIGO QUE SE LE HA ENVIADO</Text>

            <View style={styles.view1} />

            <TextInput placeholder="Codigo" value={CODIGO.Codigo} onChangeText={cambios} style={styles.input} secureTextEntry={true} />

            <View style={styles.view2} />

            <View style={styles.VerificacionChoiceContainer}>

                <Pressable style={styles.button} onPress={aceptar}>
                    <Text style={styles.buttonText}>ACEPTAR</Text>
                </Pressable>

                <Pressable style={[styles.button]} onPress={volver}>
                    <Text style={styles.buttonText}>VOLVER</Text>
                </Pressable>

            </View>
        </View>
    );
}

export default VerificacionMovil;