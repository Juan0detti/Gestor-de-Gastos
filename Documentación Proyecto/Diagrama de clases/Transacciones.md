 <h2 align='center'> Introducción</h2>
 La clase `Transaccion` representa una operación financiera concreta registrada por el usuario dentro del sistema, ya sea un **gasto**, un **ingreso**. Esta clase es fundamental para el funcionamiento del sistema, ya que constituye la **unidad básica de información financiera** a partir de la cual se generan estadísticas, balances y análisis personalizados.

Cada instancia de `Transaccion` contiene información clave como el **monto**, la **fecha**, el **tipo de transacción**, una **descripción opcional**, y un conjunto de **etiquetas asociadas** que permiten su clasificación flexible. Además, está vinculada al usuario que la creó, lo que asegura la separación y personalización de los datos dentro del sistema multiusuario.

La clase se complementa con otras entidades del modelo como `Etiqueta`, `Usuario` y `TransaccionProgramada`, permitiendo al usuario llevar un registro organizado, detallado y adaptado a sus necesidades personales de control financiero

 <h2 align='center'> Clase</h2>


| Transacciones                                                                           |
| --------------------------------------------------------------------------------------- |
| - string título<br>- int monto<br>- Date fecha<br>- string tipo<br>- string descripcion |

##
 <h2 align='center'> Relaciones</h2>

### **Usuario**

- **Multiplicidad:** `Usuario` 1 ─── 0..* `Transaccion`
    
- **Interpretación:** Cada transacción pertenece **a un único usuario**, mientras que **un usuario puede tener muchas transacciones**.
    
- **Propósito:** Garantizar que todas las operaciones financieras estén asociadas a la cuenta del usuario que las creó, permitiendo así una gestión personalizada, segura y aislada entre usuarios.
    

---

### **Etiqueta**

- **Multiplicidad:** `Transaccion` 0..* ─── 0..* `Etiqueta`
    
- **Relación:** Muchos a muchos.
    
- **Interpretación:**
    
    - Una transacción puede tener **cero o más etiquetas** asociadas.
        
    - Una etiqueta puede aplicarse a **cero o más transacciones**.
        
- **Propósito:**
    
    - Permitir al usuario **clasificar** sus transacciones con múltiples criterios (como “Comida”, “Salud”, “Educación”).
        
    - Mejorar la capacidad de **filtrado y análisis**, adaptándose a las necesidades y hábitos personales del usuario.
        

---

### **Objetivo**

- **Multiplicidad:** `Transaccion` 0..* ─── 0..* `Objetivo`
    
- **Relación:** Muchos a muchos.
    
- **Interpretación:**
    
    - Una transacción puede contribuir a uno o varios objetivos financieros Gasto acumulado.
        
    - Un objetivo puede estar compuesto por múltiples transacciones vinculadas.
        
- **Propósito:**
    
    - Establecer un vínculo funcional entre los gastos o ingresos y metas financieras concretas.
        
    - Permitir al sistema **calcular el progreso** hacia un objetivo en base a las transacciones vinculadas.

## 💰 **Rutas del recurso: Transacciones (`/api/transactions`)**

### **1️⃣ GET /api/transactions**

**Descripción:**  
Obtiene todas las transacciones del usuario autenticado.

**Ejemplo:**  
`GET /api/transactions`

**Requiere autenticación:** ✅  
**Control:** el `usuarioId` se obtiene del token JWT.

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Lista de transacciones|Devuelve un arreglo con todas las transacciones del usuario.|

---

### **2️⃣ GET /api/transactions?prop1=val1&prop2=val2**

**Descripción:**  
Filtra las transacciones según los parámetros de consulta (`query params`).  
Puede filtrarse por fecha, tipo, etiquetas, monto, etc.

**Ejemplo:**  
`GET /api/transactions?tipo=gasto&fechaInicio=2025-01-01&fechaFin=2025-01-31&etiqueta=alimentación`

**Parámetros comunes:**

|Parámetro|Tipo|Descripción|
|---|---|---|
|`tipo`|string|“ingreso” o “gasto”.|
|`fechaInicio`|string (ISO)|Fecha mínima.|
|`fechaFin`|string (ISO)|Fecha máxima.|
|`etiqueta`|string|Nombre o ID de etiqueta.|
|`montoMin` / `montoMax`|number|Rango de montos.|

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Lista de transacciones filtrada|Devuelve las que cumplen los filtros.|
|400 Bad Request|Parámetros inválidos|Algún filtro tiene formato incorrecto.|

---

### **3️⃣ POST /api/transactions**

**Descripción:**  
Crea una nueva transacción asociada al usuario autenticado.

**Body (JSON):**

`{   "tipo": "gasto",   "monto": 2500,   "descripcion": "Compra supermercado",   "fecha": "2025-10-21",   "etiquetas": ["alimentación", "hogar"] }`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|201 Created|Transacción creada|Devuelve la transacción creada con su `id`.|
|400 Bad Request|Datos inválidos|Falta un campo o el formato es incorrecto.|

---

### **4️⃣ PUT /api/transactions/:id**

**Descripción:**  
Actualiza una transacción existente.

**Ejemplo:**  
`PUT /api/transactions/73`

**Body (JSON):**

`{   "monto": 2800,   "descripcion": "Compra supermercado (con bebidas)",   "etiquetas": ["alimentación", "hogar"] }`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Transacción actualizada|Devuelve el objeto actualizado.|
|400 Bad Request|Datos inválidos|Algún campo con formato incorrecto.|
|404 Not Found|ID inexistente|No se encontró la transacción o no pertenece al usuario.|

---

### **5️⃣ DELETE /api/transactions/:id**

**Descripción:**  
Elimina una transacción del usuario autenticado.

**Ejemplo:**  
`DELETE /api/transactions/73`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|204 No Content|Eliminación exitosa|Transacción eliminada correctamente.|
|404 Not Found|ID inexistente|No se encontró la transacción o no pertenece al usuario.|
