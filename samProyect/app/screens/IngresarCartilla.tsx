import { pacientesService } from "@/services/firebase/pacientes.service";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../../styles/IngresarCartillaStyle";

function IngresarCartilla() {

    const [NumeroCartilla, setNumeroCartilla] = useState("");
    const [Error, setError] = useState("");
    const [Cargando, setCargando] = useState(false);

    const cambios = (text: string) => {
        setNumeroCartilla(text);
    };

    const aceptar = async () => {

        if (!NumeroCartilla) {
            setError("Por favor, ingrese un número de cartilla");
            return;
        }

        setError("");
        setCargando(true);

        try {
            const Paciente = await pacientesService.obtenerPorCartilla(NumeroCartilla);

            if (!Paciente) {
                setError("Cartilla no encontrada, por favor ingrese una cartilla existente");
                return;
            }

            if (!Paciente.Activo) {
                setError("Esta cartilla no se encuentra activa actualmente");
                return;
            }

            router.push({ pathname: "/screens/VerificacionChoice", params: { cartilla: NumeroCartilla } });

        } catch (e: any) {
            router.push("/screens/ScreenError");
        } finally {
            setCargando(false);
        }
    };

    const cancelar = () => {
        router.push("/screens/Hall");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Ingrese el número de su cartilla sanitaria
            </Text>

            <TextInput placeholder="Nº Cartilla" value={NumeroCartilla} onChangeText={cambios} style={styles.input} maxLength={9} secureTextEntry={true}/>

            {Error !== "" && (
                <Text style={styles.error}>{Error}</Text>
            )}

            <View style={{ flexDirection: "column", gap: 8 }}>
                <Pressable style={styles.button} onPress={aceptar} disabled={Cargando}>
                    <Text style={styles.buttonText}>
                        {Cargando ? "BUSCANDO..." : "ACEPTAR"}
                    </Text>
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