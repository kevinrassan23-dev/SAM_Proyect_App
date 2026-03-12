import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { styles } from "../../styles/VerificacionDNIStyle";


function VerificacionDNI() {

    const [dni, setDni] = useState("");
    const [error, setError] = useState("");

    const validarDNI = () => {

        const regex = /^[0-9]{8}[A-Za-z]$/;

        if (!regex.test(dni)) {
            setError("Formato no válido");
            return false;
        }

        const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
        const numero = parseInt(dni.substring(0,8));
        const letraCorrecta = letras[numero % 23];

        if (dni[8].toUpperCase() !== letraCorrecta) {
            setError("ERROR: los datos no coinciden");

            return false;
        }

        setError("");
        return true;
    };

    const handleContinue = () => {

        if (validarDNI()) {

            console.log("DNI correcto: ", dni);

            router.push("/screens/Hall")
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Ingrese su DNI/NIF:</Text>

            <TextInput
                style={styles.input}
                placeholder=" Ejemplo: (12345678Z)"
                value={dni}
                onChangeText={setDni}
                autoCapitalize="characters"
                maxLength={9}
            />

            {error !== "" && <Text style={styles.error}>{error}</Text>}

            <Pressable style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>ACEPTAR</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => router.push("/screens/VerificacionChoice")}>
                <Text style={styles.buttonText}>VOLVER</Text>
            </Pressable>
        </View>
    );
}

export default VerificacionDNI;