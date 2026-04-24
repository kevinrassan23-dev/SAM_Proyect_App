import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ALE from "../languages/ALE.json";
import ENG from "../languages/ENG.json";
import ESP from "../languages/ESP.json";
import FRA from "../languages/FRA.json";

/**
 * Inicialización de i18next para manejo de traducciones
 */
i18n.use(initReactI18next).init({
    resources: {
        es: { translation: ESP }, 
        en: { translation: ENG },
        de: { translation: ALE },
        fr: { translation: FRA },
    },
    lng: 'es', // Idioma por defecto
    fallbackLng: 'en', // Idioma de respaldo en caso de error
    compatibilityJSON: 'v3', // Requerido para compatibilidad con React Native
});

console.log(`[${new Date().toLocaleTimeString()}] [i18n] Servicio inicializado. Idioma actual: ${i18n.language}`);

export default i18n;