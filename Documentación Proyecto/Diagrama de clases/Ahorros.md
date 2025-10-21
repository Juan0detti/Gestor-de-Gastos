<h2 align='center'> Introducción</h2>

Desde las etapas posteriores del desarrollo del gestor de gastos personal, se incorporó la funcionalidad de **ahorros** como un componente clave para fomentar la **planificación financiera** y el **cumplimiento de objetivos económicos**. Esta funcionalidad permite al usuario registrar y dar seguimiento al progreso de los montos que destina a metas específicas, como la compra de un bien, el pago de una deuda o la creación de un fondo de emergencia.

Cada ahorro está asociado tanto a un **usuario** como a un **objetivo**, representando la relación directa entre los esfuerzos financieros individuales y las metas planteadas. De esta forma, el sistema no solo registra movimientos financieros, sino que también **mide el avance real** hacia el cumplimiento de los propósitos personales del usuario.

El ahorro cuenta con atributos que reflejan su **monto objetivo**, el **monto actual acumulado** y la **fecha límite** establecida para cumplir la meta. Gracias a estos datos, el gestor puede ofrecer **informes visuales y recordatorios** sobre el estado de progreso, ayudando al usuario a mantener constancia y motivación.

En conjunto, la clase **Ahorro** aporta un enfoque **orientado a resultados**, fortaleciendo el valor del sistema como una herramienta integral para la **gestión, proyección y control de las finanzas personales**.

---

<h2 align='center'> Clase</h2>

|Ahorro|
|---|
|- int IDAhorro;  <br>- string Título;  <br>- float Monto_Objetivo;  <br>- float Monto_Actual;  <br>- date Fecha_Límite;|

---

<h2 align='center'> Relaciones</h2>

### Relación con `Usuario`

- **Relación:** `Usuario` 1 --- 0..* `Ahorro`
    
- **Interpretación:** Un usuario puede tener **cero o varios ahorros registrados**, mientras que **cada ahorro pertenece a un único usuario**.
    
- **Propósito:** Permitir que cada usuario gestione de forma **independiente y personalizada** sus ahorros, asociándolos a distintos objetivos financieros y manteniendo un control sobre su progreso total.
    

---

### Relación con `Objetivo`

- **Relación:** `Objetivo` 1 --- 0..* `Ahorro`
    
- **Interpretación:** Un objetivo puede tener **uno o varios ahorros asociados**, mientras que cada ahorro se encuentra **vinculado a un solo objetivo**.
    
- **Propósito:** Vincular los ahorros con **metas específicas**, de modo que el usuario pueda visualizar qué parte de su capital está siendo destinado a cada propósito. Esta relación refuerza la coherencia entre la planificación (objetivo) y la ejecución (ahorro).


## <h2 align='center'> Introducción</h2>

El sistema de **objetivos** fue incorporado en el gestor de gastos personal como una funcionalidad central para fortalecer la **planificación económica** y la **motivación financiera** del usuario. Su propósito es ofrecer una forma estructurada de **definir, monitorear y alcanzar metas financieras concretas**, facilitando una gestión más estratégica de los recursos personales.

Cada objetivo permite establecer una **meta cuantificable** (como un monto a alcanzar o mantener), acompañada de un rango temporal determinado por fechas de inicio y fin. De esta forma, el usuario puede visualizar claramente su progreso y mantener un control más preciso sobre el cumplimiento de sus propósitos financieros.

Existen tres tipos principales de objetivos:

- **Gasto Acumulado:** controla el gasto total dentro de un período, ayudando al usuario a mantener sus consumos por debajo de un límite definido.
    
- **Saldo Mínimo:** garantiza que el usuario conserve un monto mínimo disponible, funcionando como una barrera de seguridad para evitar quedar sin fondos.
    
- **Ahorro:** representa una meta de acumulación de dinero que se **vincula directamente a un registro de Ahorro**, permitiendo un seguimiento detallado del capital destinado a esa finalidad.
    

Gracias a esta estructura, el sistema de objetivos se convierte en una herramienta **proactiva y flexible**, que guía al usuario en la toma de decisiones financieras inteligentes y alineadas con sus metas personales.

---

## <h2 align='center'> Clase</h2>

| Objetivo                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| - int IDObjetivo;  <br>- string Título;  <br>- string Descripción;  <br>- date Fecha_Inicio;  <br>- date Fecha_Fin;  <br>- string Tipo;  <br>- float Monto_Objetivo; |

---

## <h2 align='center'> Relaciones</h2>

### Relación con `Usuario`

- **Relación:** `Usuario` 1 --- 0..* `Objetivo`
    
- **Interpretación:** Un usuario puede definir **cero o varios objetivos**, mientras que **cada objetivo pertenece exclusivamente a un usuario**.
    
- **Propósito:** Permitir que cada persona configure sus propios objetivos financieros, adaptados a sus necesidades, metas y hábitos económicos.
    

---

### Relación con `Ahorro`

- **Relación:** `Objetivo` 1 --- 0..1 `Ahorro`
    
- **Interpretación:** Algunos objetivos (de tipo “Ahorro”) pueden estar **vinculados a un único registro de Ahorro**, mientras que otros (como los de tipo “Gasto Acumulado” o “Saldo Mínimo”) no requieren dicha relación.
    
- **Propósito:** Permitir la **sincronización entre los ahorros acumulados y las metas establecidas**, garantizando que el progreso financiero se refleje automáticamente en el objetivo asociado.
    

---

### Relación con `Transacción`

- **Relación:** `Objetivo` 0..* --- 0..* `Transacción`
    
- **Interpretación:** Un objetivo puede estar **asociado a múltiples transacciones** (por ejemplo, para medir el gasto acumulado o el ahorro total), y cada transacción puede contribuir al progreso de **uno o más objetivos**.
    
- **Propósito:** Vincular los movimientos financieros reales con los objetivos planificados, de manera que el sistema pueda calcular el **avance y cumplimiento automático** de cada meta.

## 🏦 **Rutas del recurso: Ahorros (`/api/saves`)**

### **1️⃣ GET /api/saves**

**Descripción:**  
Obtiene todos los ahorros del usuario autenticado.

**Ejemplo:**  
`GET /api/saves`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Lista de ahorros|Devuelve todos los registros de ahorro asociados al usuario.|

---

### **2️⃣ GET /api/saves?prop1=val1&prop2=val2**

**Descripción:**  
Filtra los ahorros según parámetros de consulta.

**Ejemplo:**  
`GET /api/saves?nombre=viaje&fechaInicio=2025-01-01&fechaFin=2025-12-31`

**Parámetros comunes:**

|Parámetro|Tipo|Descripción|
|---|---|---|
|`nombre`|string|Nombre o descripción del ahorro.|
|`fechaInicio` / `fechaFin`|string (ISO)|Filtra por rango de fechas.|
|`estado`|string|“activo”, “completado” o “cancelado”.|

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Lista filtrada|Devuelve solo los ahorros que cumplen los filtros.|
|400 Bad Request|Parámetros inválidos|Algún filtro tiene formato incorrecto.|

---

### **3️⃣ POST /api/saves**

**Descripción:**  
Crea un nuevo ahorro asociado al usuario autenticado.

**Body (JSON):**

`{   "nombre": "Viaje a la Patagonia",   "monto_objetivo": 150000,   "monto_actual": 0,   "fecha_limite": "2026-02-01",   "descripcion": "Ahorro mensual para vacaciones" }`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|201 Created|Ahorro creado|Devuelve el objeto creado.|
|400 Bad Request|Datos inválidos|Campos faltantes o formato incorrecto.|

---

### **4️⃣ PUT /api/saves/:id**

**Descripción:**  
Actualiza los datos generales de un ahorro existente (nombre, objetivo, fecha, descripción, etc.).

**Body (JSON):**

`{   "nombre": "Viaje al Sur",   "monto_objetivo": 160000,   "fecha_limite": "2026-03-01" }`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Ahorro actualizado|Devuelve el objeto modificado.|
|400 Bad Request|Datos inválidos|Formato incorrecto.|
|404 Not Found|ID inexistente|No se encontró el ahorro o no pertenece al usuario.|

---

### **5️⃣ PATCH /api/saves/:id/monto**

**🆕 Descripción (ruta especial):**  
Modifica el **monto guardado actualmente** (por ejemplo, al depositar o retirar dinero del ahorro).

**Ejemplo:**  
`PATCH /api/saves/12/monto`

**Body (JSON):**

`{   "accion": "agregar",   // o "retirar"   "monto": 5000 }`

**Comportamiento esperado:**

- Si `accion` = “agregar”, incrementa el `monto_actual`.
    
- Si `accion` = “retirar”, lo disminuye (sin permitir valores negativos).
    

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Monto actualizado|Devuelve el nuevo estado del ahorro.|
|400 Bad Request|Datos inválidos|Monto negativo o acción incorrecta.|
|404 Not Found|ID inexistente|El ahorro no existe o no pertenece al usuario.|

---

### **6️⃣ DELETE /api/saves/:id**

**Descripción:**  
Elimina un ahorro del usuario autenticado.

**Respuestas:**

| Código         | Significado         | Descripción                                         |
| -------------- | ------------------- | --------------------------------------------------- |
| 204 No Content | Eliminación exitosa | Ahorro eliminado correctamente.                     |
| 404 Not Found  | ID inexistente      | No se encontró el ahorro o no pertenece al usuario. |