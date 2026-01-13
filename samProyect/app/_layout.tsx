import { Stack } from "expo-router";
import React from "react";
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import customTheme from './theme/Theme';

const paperTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: customTheme.colors.primary,
    accent: customTheme.colors.secondary,
    background: customTheme.colors.background,
    surface: '#ffffff',
    text: customTheme.colors.textPrimary,
  },
};

function RootLayout() {
    return (
      <PaperProvider theme={paperTheme}>
        <Stack />
      </PaperProvider>
    );
}
export default RootLayout;
