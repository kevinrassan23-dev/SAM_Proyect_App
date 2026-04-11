import i18n from "@/language/config/ConfigIdiomas";
import { Redirect } from "expo-router";
import React from "react";
import { I18nextProvider } from "react-i18next";

function Index() {
  // Redirige automáticamente a /screens/Home al iniciar la app
  return (
    <I18nextProvider i18n={i18n}>
      <Redirect href="/screens/home/Home" />
    </I18nextProvider>
  );
}
export default Index;

