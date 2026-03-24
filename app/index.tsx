import { Redirect } from "expo-router";
import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../Idioma/Config/ConfigIdiomas";

function Index() {
  // Redirige automáticamente a /screens/Home al iniciar la app
  return (
    <I18nextProvider i18n={i18n}>
      <Redirect href="/screens/Home" />
    </I18nextProvider>
  );
}
export default Index;

