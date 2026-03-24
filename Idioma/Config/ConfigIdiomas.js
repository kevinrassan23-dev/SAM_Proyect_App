import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ALE from "../Idiomas/ALE.json";
import ENG from "../Idiomas/ENG.json";
import ESP from "../Idiomas/ESP.json";

i18n.use(initReactI18next).init({
    resources: {
        ESP: { translation: ESP },
        ENG: { translation: ENG },
        ALE: { translation: ALE }
    },
    lng: 'ESP',
    fallbackLng: 'ENG'
})

export default i18n;