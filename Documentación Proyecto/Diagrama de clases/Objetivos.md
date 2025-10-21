<h2 align='center'> Introducción</h2>

El sistema de **objetivos** fue incorporado en el gestor de gastos personal como una funcionalidad central para fortalecer la **planificación económica** y la **motivación financiera** del usuario. Su propósito es ofrecer una forma estructurada de **definir, monitorear y alcanzar metas financieras concretas**, facilitando una gestión más estratégica de los recursos personales.

Cada objetivo permite establecer una **meta cuantificable** (como un monto a alcanzar o mantener), acompañada de un rango temporal determinado por fechas de inicio y fin. De esta forma, el usuario puede visualizar claramente su progreso y mantener un control más preciso sobre el cumplimiento de sus propósitos financieros.

Existen tres tipos principales de objetivos:

- **Gasto Acumulado:** controla el gasto total dentro de un período, ayudando al usuario a mantener sus consumos por debajo de un límite definido.
    
- **Saldo Mínimo:** garantiza que el usuario conserve un monto mínimo disponible, funcionando como una barrera de seguridad para evitar quedar sin fondos.
    
- **Ahorro:** representa una meta de acumulación de dinero que se **vincula directamente a un registro de Ahorro**, permitiendo un seguimiento detallado del capital destinado a esa finalidad.
    

Gracias a esta estructura, el sistema de objetivos se convierte en una herramienta **proactiva y flexible**, que guía al usuario en la toma de decisiones financieras inteligentes y alineadas con sus metas personales.

---

<h2 align='center'> Clase</h2>

|Objetivo|
|---|
|- int IDObjetivo;  <br>- string Título;  <br>- string Descripción;  <br>- date Fecha_Inicio;  <br>- date Fecha_Fin;  <br>- string Tipo;  <br>- float Monto_Objetivo;|

---

<h2 align='center'> Relaciones</h2>

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

## 🎯 **Rutas del recurso: Objetivos (`/api/goals`)**

### **1️⃣ GET /api/goals**

**Descripción:**  
Obtiene todos los objetivos del usuario autenticado.

**Ejemplo:**  
`GET /api/goals`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Lista de objetivos|Devuelve todos los objetivos del usuario.|

---

### **2️⃣ GET /api/goals?prop1=val1&prop2=val2**

**Descripción:**  
Filtra los objetivos según parámetros de consulta.

**Ejemplo:**  
`GET /api/goals?estado=pendiente&fechaFin=2025-12-31`

**Parámetros comunes:**

|Parámetro|Tipo|Descripción|
|---|---|---|
|`estado`|string|“pendiente”, “en progreso” o “completado”.|
|`fechaInicio` / `fechaFin`|string (ISO)|Rango de fechas límite.|
|`nombre`|string|Filtra por nombre o palabra clave.|

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Lista filtrada|Devuelve solo los objetivos que cumplen los filtros.|
|400 Bad Request|Parámetros inválidos|Algún filtro tiene formato incorrecto.|

---

### **3️⃣ POST /api/goals**

**Descripción:**  
Crea un nuevo objetivo asociado al usuario autenticado.

**Body (JSON):**

`{   "titulo": "Ahorrar para notebook",   "descripcion": "Meta de compra antes de fin de año",   "fecha_inicio": "2025-10-01",   "fecha_limite": "2025-12-31",   "monto_objetivo": 500000 }`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|201 Created|Objetivo creado|Devuelve el objetivo con su `id`.|
|400 Bad Request|Datos inválidos|Faltan campos requeridos o formato incorrecto.|

---

### **4️⃣ PUT /api/goals/:id**

**Descripción:**  
Actualiza un objetivo existente (por ejemplo, descripción, fechas o monto).

**Body (JSON):**

`{   "titulo": "Ahorrar para notebook gamer",   "monto_objetivo": 600000 }`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Objetivo actualizado|Devuelve el nuevo estado del objetivo.|
|400 Bad Request|Datos inválidos|Algún campo con formato incorrecto.|
|404 Not Found|ID inexistente|No se encontró el objetivo o no pertenece al usuario.|

---

### **5️⃣ DELETE /api/goals/:id**

**Descripción:**  
Elimina un objetivo del usuario autenticado.

**Ejemplo:**  
`DELETE /api/goals/7`

**Respuestas:**

| Código         | Significado         | Descripción                                           |
| -------------- | ------------------- | ----------------------------------------------------- |
| 204 No Content | Eliminación exitosa | Objetivo eliminado correctamente.                     |
| 404 Not Found  | ID inexistente      | No se encontró el objetivo o no pertenece al usuario. |
