import { Redirect } from "expo-router";
import React from "react";

/**
 * Componente Index:
 * Actúa como un disparador automático para mover al usuario
 * de la raíz del proyecto hacia la pantalla Home.
 */
function Index() {
  return <Redirect href="/screens/home/Home" />;
}

export default Index;