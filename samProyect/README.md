# Librerías de trabajo y flujo de instalación del proyecto:

## Flujo de instalación:

1. Crear un proyecto en React Native:
   
   Dentro de un directorio vacío, hacemos: 

   ```bash
   npx create-expo-app nombre_de_tu_app
   ```

2. Creación de la carpeta router
   Cuando el proyecto se esté creando, nos preguntará    por el nombre de una carpeta router, puedes poner    cualquier nombre, pero es recomendable ponerlo todo en   minúscula, simple e intuitivo.

   ```bash
   proyect name: tuProyecto
   ```
   
3. Refrescar dependencias (node_modules):
   Por defecto se nos creará una carpeta node modules a la que le añadiremos dependencias futuras, si quieremos refrescar las dependencias y actualizar las añadidas cada vez que entremos al proyecto hacemos:
   
   ```bash
   npm install
   ```

4. Limpiar el proyecto:
   Si queremos simplificar nuestro proyecto solo con los archivos esenciales para el desarrollo hacemos:
   
```bash
npm run reset-project
```

5. Ejecutar para pruebas:

   ```bash
   npx expo start
   ```

## Librerías de trabajo adicionales utilizadas durante el desarrollo:

```bash
Desarrollo - Kevin:
npx install lottie-react-native -> (Animaciones)

npx expo install expo expo-font expo-router -> (si falla el router)

npx audit fix --force -> (fuerza a arreglar conflictos con dependencias istaladas)

npm install -g npm@nueva_versión -> (actualiza la versión de node de forma global)

npm install -g expo-cli -> (Expo-CLI Para confictos de dependencias JSON, Útil después de Mergear a GitHub).

npx expo-doctor -> (Depende de Expo-CLI, se utiliza para hacer test instantáneos y resolver conflictos entre dependencias JSON).


Desarrollo - Pablo:

Desarrollo - Gabriel:

Desarrollo - Hector:

```

## Git y GitHub - (Resolución de conflictos):
Si desea actualizar la estructura base del proyecto y desea subirlo a una rama auxiliar a la rama principal (main), es posible que GitHub se bloquee porque no puede manejar la resolución de varios confictos simultáneos, para ello, desde nuestro IDE local, seguiremos un proceso para sincronizar las 2 Ramas sin hacerlo sin interfaz gráfica:

1. Crear nueva rama:
   ```bash
   git checkout -b tu-rama
   ```
2. Cambiar de rama (si no estamos en ella):
   ```bash
   git checkout tu-rama
   ```

3. Traer los cambios desde Main:
   ```bash
   git fetch origin
   ```
4. Juntar las Ramas Main - Tu_Rama_Nueva:
   ```bash
   git merge origin/main
   ```
5. Hacer cambios soobre el directorio actual tu_rama -> main
    ```bash
   git add .
   ```
6. Hacemos commit y añadimos un mensaje con parámetro -m (opcional)
   ```bash
   git commit -m "Resuelto conflictos en main"
   ```
7. Hacemos push y subimos los nuevos cambios:
   ```bash
   git push origin tu-rama
   ```
Resultado: La rama main se desbloqueará y estará abierta a nuevos cambios simples.




   
