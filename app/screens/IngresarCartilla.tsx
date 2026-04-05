import { pacientesService } from "@/services/firebase/pacientes.service";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../../styles/IngresarCartillaStyle";

function IngresarCartilla() {
    const { t } = useTranslation();

    const [NumeroCartilla, setNumeroCartilla] = useState("");
    const [Error, setError] = useState("");
    const [Cargando, setCargando] = useState(false);

    const cambios = (text: string) => {
        setNumeroCartilla(text);
    };

    const aceptar = async () => {

        if (!NumeroCartilla) {
            setError(t("IngresarCartilla.ERROR1"));
            return;
        }

        setError("");
        setCargando(true);

        try {
            const Paciente = await pacientesService.obtenerPorCartilla(NumeroCartilla);

            if (!Paciente) {
                setError(t("IngresarCartilla.ERROR2"));
                return;
            }

            if (!Paciente.Activo) {
                setError(t("IngresarCartilla.ERROR3"));
                return;
            }

            router.push({ pathname: "/screens/VerificacionChoice", params: { cartilla: NumeroCartilla } });

        } catch (e: any) {
            console.log(new Date().toLocaleTimeString(), +" "+ e?.message);
        } finally {
            setCargando(false);
        }
    };

    const cancelar = () => { router.push("/screens/Hall"); };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {t("IngresarCartilla.INGRESAR")}
            </Text>

            <TextInput placeholder={t("IngresarCartilla.NºCARTILLA")} value={NumeroCartilla} onChangeText={cambios} style={styles.input} maxLength={9} secureTextEntry={true} />

            {Error !== "" && (
                <Text style={styles.error}>{Error}</Text>
            )}

            <View style={{ flexDirection: "column", gap: 8 }}>
                <Pressable style={styles.button} onPress={aceptar} disabled={Cargando}>
                    <Text style={styles.buttonText}>
                        {Cargando ? t("IngresarCartilla.BUSCANDO") : t("IngresarCartilla.ACEPTAR")}
                    </Text>
                </Pressable>

                <Pressable style={styles.buttonVolver} onPress={cancelar}>
                    <Text style={styles.buttonText}>
                        {t("IngresarCartilla.VOLVER")}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

export default IngresarCartilla;