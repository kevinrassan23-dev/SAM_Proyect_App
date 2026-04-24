# S.A.M — Instrucciones de Uso

Este documento está orientado a facilitar la evaluación y prueba del sistema S.A.M. Contiene los datos de prueba preconfigurados, el catálogo completo de medicamentos y familias, y una guía paso a paso para usar tanto el panel de administración web como la aplicación móvil Android.

---

## 1. Paciente de prueba

| Campo | Valor |
|---|---|
| ID Paciente | `PAC-003` |
| DNI | `34668740N` |
| Nombre | Jacinto Rodríguez González |
| Cartilla | `BBBBBBBBB1122334` |
| Teléfono | `+34692091210` |
| Tipo | Mutualista |
| Edad | 33 |
| Activo (en el sistema) | Sí |

---

## 2. Receta de prueba

| Campo | Valor |
|---|---|
| ID Receta | `REC-005` |
| DNI Paciente | `34668740N` |
| Nombre Paciente | Jacinto Rodríguez González |
| Cartilla | `BBBBBBBBB1122334` |
| Especialista | Ernesto Mandela |
| Afecciones | Migraña crónica |
| Centro | Hospital Santa María |
| Medicamentos | `Amoxicilina 500mg, Tramadol 50mg, Omeprazol 40mg` |
| Fecha Inicio | 03/01/2026 |
| Fecha Expiración | 30/09/2026 |
| Activa (en el sistema) | Sí |

---

## 3. Catálogo de medicamentos

### 3.1 Familias — Medicamentos CON RECETA

- Antibióticos
- Antidiabéticos
- Cardiovascular
- Gastrointestinal
- Hormonal
- Respiratorio
- Sistema Nervioso
- Analgésicos
- Inmunosupresor

### 3.2 Medicamentos CON RECETA (MED-001 a MED-030)

| ID | Nombre | Marca | Precio | Familia |
|---|---|---|---|---|
| MED-001 | Amoxicilina 500mg | Normon | 8.50 € | Antibióticos |
| MED-002 | Augmentine 875mg | GSK | 12.90 € | Antibióticos |
| MED-003 | Azitromicina 500mg | Cinfa | 9.80 € | Antibióticos |
| MED-004 | Ciprofloxacino 500mg | Bayer | 11.20 € | Antibióticos |
| MED-005 | Metformina 850mg | Ratiopharm | 3.40 € | Antidiabéticos |
| MED-006 | Insulina Glargina 100UI | Sanofi | 45.00 € | Antidiabéticos |
| MED-007 | Sitagliptina 100mg | MSD | 38.50 € | Antidiabéticos |
| MED-008 | Atorvastatina 40mg | Pfizer | 7.60 € | Cardiovascular |
| MED-009 | Ramipril 5mg | Ratiopharm | 4.20 € | Cardiovascular |
| MED-010 | Amlodipino 10mg | Normon | 3.80 € | Cardiovascular |
| MED-011 | Bisoprolol 5mg | Ratiopharm | 4.10 € | Cardiovascular |
| MED-012 | Omeprazol 40mg | Cinfa | 5.30 € | Gastrointestinal |
| MED-013 | Pantoprazol 40mg | Normon | 5.80 € | Gastrointestinal |
| MED-014 | Metoclopramida 10mg | Rovi | 3.20 € | Gastrointestinal |
| MED-015 | Levotiroxina 50mcg | Merck | 6.90 € | Hormonal |
| MED-016 | Prednisona 20mg | Sanofi | 4.70 € | Hormonal |
| MED-017 | Salbutamol 100mcg Inhalador | GSK | 9.50 € | Respiratorio |
| MED-018 | Budesonida 200mcg | AstraZeneca | 18.40 € | Respiratorio |
| MED-019 | Montelukast 10mg | MSD | 14.20 € | Respiratorio |
| MED-020 | Diazepam 5mg | Roche | 3.60 € | Sistema Nervioso |
| MED-021 | Sertralina 50mg | Pfizer | 8.10 € | Sistema Nervioso |
| MED-022 | Quetiapina 100mg | AstraZeneca | 22.60 € | Sistema Nervioso |
| MED-023 | Tramadol 50mg | Grünenthal | 6.40 € | Analgésicos |
| MED-024 | Morfina 10mg | Mundipharma | 15.80 € | Analgésicos |
| MED-025 | Warfarina 5mg | Bristol-Myers | 4.30 € | Cardiovascular |
| MED-026 | Furosemida 40mg | Sanofi | 2.90 € | Cardiovascular |
| MED-027 | Claritromicina 500mg | Abbott | 10.70 € | Antibióticos |
| MED-028 | Lorazepam 1mg | Wyeth | 3.10 € | Sistema Nervioso |
| MED-029 | Metotrexato 2.5mg | Pfizer | 19.50 € | Inmunosupresor |
| MED-030 | Adalimumab 40mg | AbbVie | 850.00 € | Inmunosupresor |

### 3.3 Familias — Medicamentos SIN RECETA

- Primeros auxilios
- Salud bucal
- Analgésicos
- Gripe y resfriado
- Alérgenos
- Cuidado del cabello y piel
- Dieta y nutrición

### 3.4 Medicamentos SIN RECETA (MED-031 a MED-066)

| ID | Nombre | Marca | Precio | Familia |
|---|---|---|---|---|
| MED-031 | Agua Oxigenada 3% | Genérico | 1.50 € | Primeros auxilios |
| MED-032 | Alcohol 70% | Acofar | 2.80 € | Primeros auxilios |
| MED-033 | Vendas Elásticas | Hansaplast | 3.50 € | Primeros auxilios |
| MED-034 | Tiritas Surtidas | Hansaplast | 3.00 € | Primeros auxilios |
| MED-035 | Suero Fisiológico Monodosis | Monodosis | 1010.00 € | Primeros auxilios |
| MED-036 | Pasta Dental Flúor | Colgate | 3.00 € | Salud bucal |
| MED-037 | Colutorio Antiséptico | Listerine | 5.20 € | Salud bucal |
| MED-038 | Hilo Dental | Oral-B | 2.50 € | Salud bucal |
| MED-039 | Gel Gingival Anestésico | Dentinox | 6.80 € | Salud bucal |
| MED-040 | Pastillas para la Garganta | Strepsils | 4.50 € | Salud bucal |
| MED-041 | Paracetamol 650mg | Efferalgan | 3.20 € | Analgésicos |
| MED-042 | Ibuprofeno 400mg | Nurofen | 4.10 € | Analgésicos |
| MED-043 | Aspirina 500mg | Bayer | 2.90 € | Analgésicos |
| MED-044 | Naproxeno 250mg | Stadamed | 4.60 € | Analgésicos |
| MED-045 | Metamizol 575mg | Normon | 3.70 € | Analgésicos |
| MED-046 | Frenadol Complex | Johnson & Johnson | 7.50 € | Gripe y resfriado |
| MED-047 | Bisolvon Jarabe | Boehringer | 6.90 € | Gripe y resfriado |
| MED-048 | Otrivina Spray Nasal | Novartis | 5.40 € | Gripe y resfriado |
| MED-049 | Gripavick | Vick | 5.20 € | Gripe y resfriado |
| MED-050 | Iniston Antitusivo | Pfizer | 6.10 € | Gripe y resfriado |
| MED-051 | Loratadina 10mg | Cinfa | 3.80 € | Alérgenos |
| MED-052 | Cetirizina 10mg | Normon | 3.60 € | Alérgenos |
| MED-053 | Ebastina 10mg | Almirall | 5.20 € | Alérgenos |
| MED-054 | Fexofenadina 120mg | Aventis | 6.40 € | Alérgenos |
| MED-055 | Bilastina 20mg | Menarini | 7.10 € | Alérgenos |
| MED-056 | Nizoral Champú | Janssen | 9.80 € | Cuidado del cabello y piel |
| MED-057 | Panthenol Crema | Bepanthol | 8.50 € | Cuidado del cabello y piel |
| MED-058 | Hidrocortisona 1% Crema | Genérico | 4.90 € | Cuidado del cabello y piel |
| MED-059 | Capilar Minoxidil 2% | Regaine | 18.90 € | Cuidado del cabello y piel |
| MED-060 | Fluconazol 150mg Crema | Canesten | 7.30 € | Cuidado del cabello y piel |
| MED-061 | Omega-3 1000mg | Solgar | 14.50 € | Dieta y nutrición |
| MED-062 | Vitamina D3 1000UI | Kern Pharma | 8.20 € | Dieta y nutrición |
| MED-063 | Magnesio 400mg | Cinfa | 7.60 € | Dieta y nutrición |
| MED-064 | Probióticos Lactobacillus | Activia | 11.30 € | Dieta y nutrición |
| MED-065 | Hierro Bisglicimato 25mg | Procare | 9.40 € | Dieta y nutrición |
| MED-066 | Colágeno Marino Premium 10000mg | Solgar | 1250.00 € | Dieta y nutrición |

---

## 4. Guía de uso — S.A.M-WEB

1. Accede al panel web e inicia sesión como `ADMIN_OWNER` (recomendado) o con cualquier otro rol según tus preferencias.

2. Configura un nuevo paciente o actualiza el número de teléfono del paciente de prueba sustituyéndolo por un número real para que los SMS lleguen correctamente a la app.

   > **Nota:** El número preconfigurado del paciente de prueba es un número de prueba para no activar las alarmas anti-spam de la operadora en entorno de desarrollo. Su código de acceso fijo es `123456`.

3. Crea una receta nueva o modifica la receta preconfigurada `REC-005`.

   > **Nota:** Los medicamentos que añadas a la receta deben estar registrados en el catálogo con receta. Consulta la [tabla de medicamentos con receta](#32-medicamentos-con-receta-med-001-a-med-030).

4. Puedes crear, buscar, actualizar o eliminar medicamentos desde la sección **Tienda → Medicamentos**.

   > **Nota:** Las familias deben escribirse exactamente como aparecen en el catálogo — el sistema es sensible a mayúsculas, minúsculas y tildes. Consulta las [familias con receta](#31-familias--medicamentos-con-receta) y las [familias sin receta](#33-familias--medicamentos-sin-receta).

5. Desde la sección **Administradores** puedes gestionar los registros de administradores del sistema.

   > **Nota:** Solo los roles `SYSTEM_ADMIN` y `SHOP_ADMIN` pueden ser modificados o eliminados desde el panel. Los roles `ADMIN_OWNER` y `GOV_ADMIN` están protegidos.

   > **Nota:** Al insertar un nuevo administrador recuerda la contraseña — una vez creado el registro no se vuelve a mostrar. La contraseña requiere mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales.

---

## 5. Guía de uso — S.A.M-APP

1. Introduce la cartilla sanitaria del paciente configurado.

2. Introduce el número de teléfono asociado al paciente — recibirás un SMS con un código numérico de 6 dígitos.

3. Introduce el código SMS antes de que expire el tiempo establecido.

> **Nota:** Si el sistema solicita reCAPTCHA es necesario cumplimentarlo. Si el reCAPTCHA da problemas con el emulador, utiliza la app **Expo Go** en tu teléfono móvil conectado a la misma red para conectarte directamente con el servidor. Consulta la [instalación con Expo Go](./README.md#pruebas-en-dispositivo-físico-con-expo-go)

4. Una vez dentro de la tienda verás la sección **Con Receta** desbloqueada con los medicamentos asociados al paciente. Debajo encontrarás la sección **Sin Receta** con el resto del catálogo disponible. Para añadir un medicamento con receta al carrito pulsa sobre él y se agregará automáticamente.

5. Selecciona el método de pago preferido.

   > **Nota:** Si el total supera los **1000 €** la opción de pago en efectivo quedará bloqueada automáticamente.

6. Completa el pago y recoge el pedido dispensado.