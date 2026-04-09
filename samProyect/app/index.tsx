import { Redirect } from "expo-router";
import React from "react";

function Index() {
  // Redirige automáticamente a /screens/Home al iniciar la app
  return <Redirect href="/screens/home/Home" />;
}
export default Index;

