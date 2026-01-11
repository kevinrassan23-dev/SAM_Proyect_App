const customTheme = {
    colors: {
        // Color de fondo
        background: "#FFFFFF",

        // Colores principales (verde y violeta salud)
        primary: "#16C172",          
        secondary: "#9525D7",        

        // Texto
        textPrimary: "#000000ff",
        textSecondary: "#ffffffff",

        // Estado de mensajes
        error: "#ff2b1c",           
        warning: "#e4dd00ff",          
        info: "#eb8d00ff",            
        success: "#2196f3",          
    },

    // Tamaños de fuente
    fontSize: {
        small: 14,
        normal: 16,
        large: 20,
        title: 24,
    },

    spacing: (value: number) => value * 8
};

export default customTheme;
