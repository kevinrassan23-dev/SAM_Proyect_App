import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { styles } from "../../styles/IngresarCartillaStyle";

function IngresarCartilla() {
    
    const [numeroCartilla, setNumeroCartilla] = useState("");
    const [error, setError] = useState("");

    const onChangeCartilla = (text: string) => {
        setNumeroCartilla(text);
    };

    const aceptar = () => {
        router.push("/screens/VerificacionChoice");
    };

    const cancelar = () => {
        router.push("/screens/Hall");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Ingrese el número de su cartilla sanitaria
            </Text>

            <TextInput
                placeholder="Nº Cartilla"
                value={numeroCartilla}
                onChangeText={onChangeCartilla}
                style={styles.input}
            />

            {error !== "" && (
                <Text style={styles.error}>{error}</Text>
            )}

            <View style={{ flexDirection: "column", gap: 8 }}>
                <Pressable style={styles.button} onPress={aceptar}>
                    <Text style={styles.buttonText}>ACEPTAR</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={cancelar}>
                    <Text style={styles.buttonText}>
                        VOLVER A LA TIENDA
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

export default IngresarCartilla;