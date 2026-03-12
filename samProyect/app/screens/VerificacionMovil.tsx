import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { pacientesService } from "@/services";
import { styles } from "../../styles/VerificacionMovilStyle";

function VerificacionMovil() {
    const { cartilla } = useLocalSearchParams<{ cartilla: string }>();

    const [TLF, setTLF] = useState("");
    const [Error, setError] = useState("");
    const [Verificar, setVerificar] = useState(false);

    const cambios = (text: string) => {
        setTLF(text);
    }
    const aceptar = async () => {

        setVerificar(true);
        setError("");

        try {
            const VERFICACIÓN = await pacientesService.validarPorCartillaYTelefono(cartilla, TLF);

            if (!VERFICACIÓN.valido) {
                setError("No se ha podido verificar su número de teléfono, intentelo de nuevo");
                return;
            }

            router.push({ pathname: "/screens/Hall"});


        } catch (e: any) {
            router.push("/screens/ScreenError");
        } finally {
            setVerificar(false);
        }
    };

    const volver = () => {
        router.push("/screens/VerificacionChoice")
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>INGRESE LOS ÚLTIMOS 4 DIGITOS DE SU NÚMERO DE TELÉFONO</Text>

            <View style={styles.view1} />

            <TextInput placeholder="Codigo" value={TLF} onChangeText={cambios} style={styles.input} secureTextEntry={true} maxLength={4} />

            {Error !== "" && (
                <Text style={styles.error}>{Error}</Text>
            )}

            <View style={styles.view2} />

            <View style={styles.VerificacionChoiceContainer}>

                <Pressable style={styles.button} onPress={aceptar} disabled={Verificar}>
                    <Text style={styles.buttonText}>
                        {Verificar ? "VERIFICANDO..." : "ACEPTAR"}
                    </Text>
                </Pressable>

                <Pressable style={[styles.button]} onPress={volver}>
                    <Text style={styles.buttonText}>VOLVER</Text>
                </Pressable>

            </View>
        </View>
    );
}

export default VerificacionMovil;