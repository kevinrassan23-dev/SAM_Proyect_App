import { Redirect } from "expo-router";
import React from "react";

function Index() {
  return (

    // Importamos la ruta padre el índice de la aplicación 
    // como la primera que aparece
    <Redirect href="./screens/Home" />
  );
}
export default Index;

