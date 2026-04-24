# S.A.M — Sistema Automático de Medicamentos

Dispensador automático de medicamentos con autenticación OTP por SMS, panel de administración web y gestión de recetas médicas. El sistema está compuesto por dos aplicaciones complementarias y dependientes entre sí que comparten las mismas bases de datos Firebase y Supabase.

---

## Gestión del proyecto

- **Plataforma de gestión:** [ClickUp](https://app.clickup.com/90151830823/v/li/901518850466)
- **Repositorio S.A.M-APP:** [GitHub](https://github.com/kevinrassan23-dev/SAM_Proyect_App.git)
- **Repositorio S.A.M-WEB:** [GitHub](https://github.com/kevinrassan23-dev/SAM_Proyect_WebAdmin.git)
- **Vídeo promocional:** [Ver en Canva](https://canva.link/ctdtg9niivgyayu)

---

## Requisitos del sistema

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18.x o superior |
| npm | 9.x o superior |
| Expo CLI | `npx expo` (incluido, no requiere instalación global) |
| Android Studio | Hedgehog o superior (solo para emulador Android) |
| Sistema operativo | Windows 10/11, macOS 12+, Ubuntu 20.04+ |

**S.A.M-APP** — Expo SDK `~54.0.33` · React Native `0.81.5` · React `19.1.0`

**S.A.M-WEB** — Expo SDK `51.0.39` · React Native `0.74.5` · React `18.2.0`

---

## Crear un proyecto React Native Expo desde cero

Si necesitas replicar la estructura base del proyecto en un entorno limpio, sigue estos pasos:

### 1. Crear el proyecto

Dentro de un directorio vacío ejecuta:

```bash
npx create-expo-app nombre_de_tu_app
```

Durante la creación se pedirá el nombre del proyecto. Se recomienda usar un nombre en minúsculas, simple e intuitivo:

```
project name: tuproyecto
```

### 2. Instalar dependencias

Por defecto se crea una carpeta `node_modules`. Para instalar o refrescar las dependencias cada vez que entres al proyecto:

```bash
npm install
```

### 3. Limpiar la plantilla

Para simplificar el proyecto y quedarte solo con los archivos esenciales para el desarrollo:

```bash
npm run reset-project
```

### 4. Ejecutar para pruebas

```bash
npx expo start -c
```

---

## Instalación del proyecto existente

### 1. Descarga del proyecto

```bash
# Opción A — Clonar vía Git
git clone https://github.com/kevinrassan23-dev/SAM_Proyect_App.git
git clone https://github.com/kevinrassan23-dev/SAM_Proyect_WebAdmin.git

# Opción B — Descargar ZIP desde GitHub y descomprimir
```

### 2. Abrir el proyecto en tu editor

```bash
cd samProyect (APP)
cd samProyectAdmin (WEB)
code .
```

### 3. Instalar node_modules

```bash
npm install
```

### 4. Variables de entorno

Renombra el fichero `.env.example` a `.env` y rellena los valores proporcionados en `credenciales.txt`:

```env
# SUPABASE
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# FIREBASE
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### 5. Arrancar el proyecto

**S.A.M-APP (Android — emulador):**
```bash
npx expo start -c
```
Luego en Android Studio: `Inicio > 3 botones > Virtual Device Manager > Pixel 9a (Google Play)`.
Una vez cargado el emulador, pulsa `-a` en el terminal.

**S.A.M-WEB (Navegador):**
```bash
npx expo start -c
```
Una vez cargadas las variables, pulsa `-w` en el terminal.

---

## Pruebas en dispositivo físico con Expo Go

Como alternativa al emulador, es posible ejecutar la aplicación directamente en un dispositivo Android físico mediante la app **Expo Go**.

### Pasos:

1. Descarga la app **Expo Go** desde Google Play Store en tu dispositivo Android.
2. Abre la app y llega hasta la pantalla principal.
3. Ejecuta el siguiente comando en el terminal del proyecto:

```bash
npx expo start -c --host tunnel
```

4. Escanea el código QR que aparece en el terminal con la cámara o desde la propia app Expo Go.

**Resultado:** La aplicación se ejecuta de forma nativa dentro de Expo Go en el dispositivo móvil.

> **Nota:** Ambos dispositivos (el ordenador y el móvil) deben estar conectados a la misma red para que el tunnel funcione correctamente.

---

## Guía de pruebas de uso

Para que la aplicación funcione correctamente es necesario configurar previamente los datos en el panel de administración web.

### Paso 1 — Configurar el paciente

Accede a S.A.M-WEB con rol `ADMIN_OWNER` o `GOV_ADMIN` y crea un paciente con un número de teléfono real al que tengas acceso. El SMS de verificación se enviará a ese número, por lo que si introduces un número incorrecto el código llegará a otra persona.

### Paso 2 — Crear la receta (opcional)

Si el paciente debe tener medicamentos con receta, crea una receta asociada por DNI y número de cartilla con los medicamentos que deben aparecer en la sección "Con Receta" de la aplicación. Si el paciente no requiere receta, este paso no es necesario.

> **Nota:** Si el medicamento indicado en la receta no existe en el catálogo de medicamentos de Supabase, no aparecerá en la sección con receta del paciente. Esta validación cruzada no pudo completarse en su totalidad por limitaciones de tiempo.

### Paso 3 — Usar la aplicación Android

1. Abre S.A.M-APP e introduce la cartilla y el número de teléfono configurados.
2. Se enviará automáticamente un SMS con un código numérico de 6 dígitos.
3. Introduce el código para acceder a la tienda con la receta desbloqueada y el catálogo completo de medicamentos sin receta disponible.

### Usuario de prueba preconfigurado

Si no deseas usar un número real y enviar un SMS real, está disponible el siguiente usuario de prueba:

| Campo | Valor |
|---|---|
| DNI | `34668740N` |
| Nombre | Jacinto Rodríguez González |
| Cartilla | `BBBBBBBBB1122334` |
| Teléfono | `+34692091210` |
| Tipo | Mutualista |
| Activo (En el sistema) | Sí |

---

> Nota: El código de acceso para este usuario de prueba es: `123456`.

## Consideraciones sobre los roles

| Rol | Propósito |
|---|---|
| `ADMIN_OWNER` | Acceso total al sistema. Creado para facilitar la evaluación sin necesidad de cambiar de cuenta. |
| `GOV_ADMIN` | Acceso a datos oficiales (pacientes y recetas). Creado para simular el rol de gestión sanitaria. |
| `SYSTEM_ADMIN` | Acceso a administradores y tienda. Rol operativo habitual en un entorno real. |
| `SHOP_ADMIN` | Acceso exclusivo a la tienda. Rol operativo habitual en un entorno real. |

Los roles configurables a nivel realista en producción serían `SYSTEM_ADMIN` y `SHOP_ADMIN`. Los roles `ADMIN_OWNER` y `GOV_ADMIN` no son seleccionables desde el formulario de inserción del panel y solo pueden asignarse directamente en la base de datos.

---

## Librerías e instalación manual

### S.A.M-APP — Expo SDK ~54.0.33

**Producción:**
```bash
npm install expo@~54.0.33
npm install expo-router@~6.0.23
npm install expo-constants@~18.0.13
npm install expo-font@~14.0.11
npm install expo-haptics@~15.0.8
npm install expo-image@~3.0.11
npm install expo-linking@~8.0.11
npm install expo-splash-screen@~31.0.13
npm install expo-status-bar@~3.0.9
npm install expo-symbols@~1.0.8
npm install expo-system-ui@~6.0.9
npm install expo-web-browser@~15.0.10
npm install expo-av@^16.0.8
npm install expo-firebase-recaptcha@^2.3.1
npm install react@19.1.0
npm install react-dom@19.1.0
npm install react-native@0.81.5
npm install react-native-web@~0.21.0
npm install react-native-gesture-handler@~2.28.0
npm install react-native-reanimated@~4.1.1
npm install react-native-safe-area-context@~5.6.0
npm install react-native-screens@~4.16.0
npm install react-native-paper@^5.14.5
npm install react-native-webview@^13.16.1
npm install react-native-worklets@0.5.1
npm install @react-navigation/native@^7.1.8
npm install @react-navigation/bottom-tabs@^7.4.0
npm install @react-navigation/elements@^2.6.3
npm install firebase@^12.10.0
npm install @firebase/auth@^1.12.2
npm install @supabase/supabase-js@^2.99.1
npm install @react-native-async-storage/async-storage@^2.2.0
npm install @expo/vector-icons@^15.0.3
npm install @expo/ngrok@^4.1.3
npm install i18next@^26.0.4
npm install react-i18next@^17.0.2
npm install lottie-react-native@^7.3.5
npm install @lottiefiles/dotlottie-react@^0.13.5
```

**Desarrollo:**
```bash
npm install --save-dev typescript@~5.9.2
npm install --save-dev eslint@^9.25.0
npm install --save-dev eslint-config-expo@~10.0.0
npm install --save-dev @types/react@~19.1.0
npm install --save-dev @types/react-i18next@^7.8.3
```

**Comando unificado S.A.M-APP:**
```bash
npm install expo@~54.0.33 expo-router@~6.0.23 expo-constants@~18.0.13 expo-font@~14.0.11 expo-haptics@~15.0.8 expo-image@~3.0.11 expo-linking@~8.0.11 expo-splash-screen@~31.0.13 expo-status-bar@~3.0.9 expo-symbols@~1.0.8 expo-system-ui@~6.0.9 expo-web-browser@~15.0.10 expo-av@^16.0.8 expo-firebase-recaptcha@^2.3.1 react@19.1.0 react-dom@19.1.0 react-native@0.81.5 react-native-web@~0.21.0 react-native-gesture-handler@~2.28.0 react-native-reanimated@~4.1.1 react-native-safe-area-context@~5.6.0 react-native-screens@~4.16.0 react-native-paper@^5.14.5 react-native-webview@^13.16.1 react-native-worklets@0.5.1 @react-navigation/native@^7.1.8 @react-navigation/bottom-tabs@^7.4.0 @react-navigation/elements@^2.6.3 firebase@^12.10.0 @firebase/auth@^1.12.2 @supabase/supabase-js@^2.99.1 @react-native-async-storage/async-storage@^2.2.0 @expo/vector-icons@^15.0.3 @expo/ngrok@^4.1.3 i18next@^26.0.4 react-i18next@^17.0.2 lottie-react-native@^7.3.5 @lottiefiles/dotlottie-react@^0.13.5 && npm install --save-dev typescript@~5.9.2 eslint@^9.25.0 eslint-config-expo@~10.0.0 @types/react@~19.1.0 @types/react-i18next@^7.8.3
```

---

### S.A.M-WEB — Expo SDK 51.0.39

**Producción:**
```bash
npm install expo@51.0.39
npm install expo-router@3.5.24
npm install expo-constants@16.0.2
npm install expo-font@12.0.10
npm install expo-haptics@13.0.1
npm install expo-image@1.13.0
npm install expo-linking@6.3.1
npm install expo-splash-screen@0.27.7
npm install expo-status-bar@1.12.1
npm install expo-symbols@0.1.5
npm install expo-system-ui@3.0.7
npm install expo-web-browser@13.0.3
npm install react@18.2.0
npm install react-dom@18.2.0
npm install react-native@0.74.5
npm install react-native-web@~0.19.10
npm install react-native-gesture-handler@2.16.1
npm install react-native-reanimated@3.10.1
npm install react-native-safe-area-context@4.10.5
npm install react-native-screens@3.31.1
npm install @react-navigation/native@^6.1.18
npm install @react-navigation/bottom-tabs@^6.6.1
npm install @react-navigation/elements@^1.3.30
npm install firebase@^12.10.0
npm install @supabase/supabase-js@^2.96.0
npm install @react-native-async-storage/async-storage@1.23.1
npm install @expo/vector-icons@^14.0.3
npm install bcryptjs@^3.0.3
npm install lottie-react-native@6.7.0
npm install @lottiefiles/dotlottie-react@^0.13.5
```

**Desarrollo:**
```bash
npm install --save-dev typescript@5.3.3
npm install --save-dev eslint@8.57.0
npm install --save-dev eslint-config-expo@7.1.2
npm install --save-dev @types/react@18.2.79
npm install --save-dev @types/bcryptjs@^2.4.6
npm install --save-dev @types/node@^20.0.0
```

**Comando unificado S.A.M-WEB:**
```bash
npm install expo@51.0.39 expo-router@3.5.24 expo-constants@16.0.2 expo-font@12.0.10 expo-haptics@13.0.1 expo-image@1.13.0 expo-linking@6.3.1 expo-splash-screen@0.27.7 expo-status-bar@1.12.1 expo-symbols@0.1.5 expo-system-ui@3.0.7 expo-web-browser@13.0.3 react@18.2.0 react-dom@18.2.0 react-native@0.74.5 react-native-web@~0.19.10 react-native-gesture-handler@2.16.1 react-native-reanimated@3.10.1 react-native-safe-area-context@4.10.5 react-native-screens@3.31.1 @react-navigation/native@^6.1.18 @react-navigation/bottom-tabs@^6.6.1 @react-navigation/elements@^1.3.30 firebase@^12.10.0 @supabase/supabase-js@^2.96.0 @react-native-async-storage/async-storage@1.23.1 @expo/vector-icons@^14.0.3 bcryptjs@^3.0.3 lottie-react-native@6.7.0 @lottiefiles/dotlottie-react@^0.13.5 && npm install --save-dev typescript@5.3.3 eslint@8.57.0 eslint-config-expo@7.1.2 @types/react@18.2.79 @types/bcryptjs@^2.4.6 @types/node@^20.0.0
```

---

## Explicación de clases y código fuente

### S.A.M-APP

**Pantallas:**
- **InsertarCartilla:** Inserta y valida la cartilla sanitaria.
- **VerificaciónMóvil:** Inserta y valida el número de teléfono.
- **VerificaciónOTP:** Envía un SMS y verifica el paciente registrado.
- **Hall:** Es la tienda y pantalla principal donde se compran los medicamentos.
- **FormaPago:** Permite elegir entre las diferentes formas de pago.
- **PagoEfectivo:** Establece el pago en efectivo.
- **PagoTarjeta:** Establece el pago con tarjeta.
- **PagoNFC:** Establece el pago por móvil NFC.
- **Confirmación:** Crea y procesa el pedido y dispensa los medicamentos.

**Servicios Firebase:**
- **pacientes.ts:** Valida y consulta pacientes por cartilla, DNI y teléfono en Firestore con validación cruzada de identidad.
- **phoneAuth.ts:** Gestiona el envío y verificación del código OTP por SMS mediante Firebase Phone Authentication.
- **recetas.ts:** Obtiene recetas activas del paciente, cruza medicamentos con Supabase y gestiona bloqueos locales de 1 hora tras compra.
- **validacion.ts:** Centraliza la validación de formato de cartilla, contraseña PIN y recopila el perfil completo del paciente en una sola llamada.

**Servicios Supabase:**
- **carrito.ts:** Gestiona el carrito de compra del paciente — agregar, eliminar, vaciar y calcular el total con descuentos aplicados por tipo de paciente.
- **descuentos.ts:** Obtiene el porcentaje de descuento aplicable según el tipo de paciente (activo, pensionista, mutualista).
- **medicamentos.ts:** Consulta el catálogo de medicamentos — obtiene sin receta, por familia, por ID, todos, y actualiza el stock tras cada compra.
- **pedidos.ts:** Crea el pedido completo con sus líneas, registra la transacción financiera, actualiza el estado y audita el historial.
- **retelimitPedidos.ts:** Controla el rate limit de compras por medicamento y sesión usando AsyncStorage, bloqueando el mismo medicamento durante 1 hora tras 2 pedidos.

**Servicios raíz:**
- **AudioService.ts:** Gestiona la reproducción de audio del dispensador para el feedback sonoro durante la dispensación.

---

### S.A.M-WEB

**Pantallas:**
- **LoginAdmin:** Pantalla de autenticación para administradores con rate limiting.
- **MostrarPedidos:** Panel principal que muestra el historial de transacciones en tabla.
- **InsertarAdmin:** Registra un nuevo administrador con rol y contraseña cifrada.
- **BuscarAdmin:** Busca un administrador por ID o correo electrónico.
- **ActualizarAdmin:** Busca y edita los datos de un administrador existente.
- **EliminarAdmin:** Busca y elimina un administrador con confirmación previa.
- **InsertarPaciente:** Registra un nuevo paciente con validación de DNI y cartilla sanitaria.
- **BuscarPaciente:** Busca pacientes por DNI o número de cartilla.
- **ActualizarPaciente:** Busca y edita los datos de un paciente existente.
- **EliminarPaciente:** Busca y elimina un paciente con confirmación previa.
- **InsertarReceta:** Registra una nueva receta médica vinculada a un paciente.
- **BuscarReceta:** Busca recetas por DNI de paciente o ID de receta.
- **ActualizarReceta:** Busca y edita una receta médica existente.
- **EliminarReceta:** Busca y elimina una receta con confirmación previa.
- **InsertarMedicamento:** Registra un nuevo medicamento en el catálogo.
- **BuscarMedicamento:** Busca medicamentos por nombre, familia o ID.
- **ActualizarMedicamento:** Busca y edita un medicamento existente.
- **EliminarMedicamento:** Busca y elimina un medicamento con confirmación previa.
- **PageError:** Pantalla de acceso denegado para rutas no autorizadas.

**Servicios:**
- **adminAuthService:** Gestiona el login, logout y verificación de sesión del administrador mediante bcrypt y AsyncStorage.
- **adminService:** CRUD completo de administradores en Supabase con cifrado de contraseña y gestión de roles.
- **pedidosService:** Recupera las últimas 200 transacciones de Supabase ordenadas por fecha para el panel.
- **pacientesService:** CRUD completo de pacientes en Firebase Firestore con validación de duplicados y borrado lógico.
- **recetasService:** CRUD completo de recetas en Firebase Firestore con validación de duplicados por fecha y especialista.
- **medicamentosService:** CRUD completo del catálogo de medicamentos en Supabase con generación de ID formato MED-NNN.
- **validators:** Valida formato de email y contraseña con requisitos de seguridad para el login del administrador.
- **useAuthGuard:** Hook que protege rutas verificando la sesión activa y redirige a PageError si no existe.

**Cuentas y roles registrados en el sistema:**
| Email | Rol |
|---|---|
| `kevinadmin@samproyect.com` | `ADMIN_OWNER` |
| `pabloadmin@samproyect.com` | `SYSTEM_ADMIN` |
| `gabiadmin@samproyect.com` | `GOV_ADMIN` |
| `hectoradmin@samproyect.com` | `SHOP_ADMIN` |

> Las credenciales de acceso se encuentran en el fichero `credenciales.txt` incluido en la entrega.
