 <h2 align='center'> Introducción</h2>

Desde las primeras etapas del desarrollo del gestor de gastos personal, se incorporó un sistema de **etiquetas** como una funcionalidad clave para brindar al usuario un mayor nivel de **personalización y control** sobre sus registros financieros. Cada etiqueta cuenta con un **nombre representativo** y un valor de **frecuencia de uso**, que refleja cuántas veces ha sido utilizada en transacciones, permitiendo así identificar rápidamente las categorías más relevantes en la vida financiera del usuario.

El objetivo principal de esta funcionalidad es permitir una **categorización simple pero detallada** de las transacciones, facilitando su organización y análisis posterior. Las etiquetas ofrecen una manera flexible de reflejar información adicional sobre cada movimiento, adaptándose a las particularidades de cada persona y promoviendo una mejor comprensión de sus hábitos de gasto e ingreso.

En versiones más recientes, se añadió a las etiquetas un atributo adicional: su **tipo**, que puede ser "Gasto" o "Ingreso"(mismos que el de las transacciones). Esta mejora permite una clasificación más precisa, alineada con la naturaleza financiera de cada transacción, y fortalece las capacidades del sistema para ofrecer reportes, filtrados y visualizaciones más útiles y personalizadas.

Así, el sistema de etiquetas combina **personalización, simplicidad y estructura**, constituyéndose como una herramienta fundamental para enriquecer la experiencia del usuario y fomentar una gestión financiera más consciente.

 <h2 align='center'> Clase</h2>
 

| Etiqueta                                                |
| ------------------------------------------------------- |
| - string Nombre;<br>- string tipo;<br>- int frecuencia; |
##

 <h2 align='center'> Relaciones</h2>
### Relación con `Usuario`

- **Relación:** `Usuario` 1 --- 0..* `Etiqueta`
    
- **Interpretación:** Un usuario puede crear **cero o muchas etiquetas personalizadas**, pero **cada etiqueta pertenece a un único usuario**.
    
- **Propósito:** Permitir que cada usuario defina su propio conjunto de etiquetas (por ejemplo: `Comida`, `Educación`, `Suscripciones`) para categorizar sus registros. Esto hace al sistema altamente **personalizable**.
    

---

### Relación con `Transaccion`

- **Relación:** `Etiqueta` 0..* --- 0..* `Transaccion`
    
- (Relación **muchos a muchos**)
    
- **Interpretación:** Una transacción puede tener **ninguna, una o varias etiquetas**, y **una etiqueta puede estar asociada a muchas transacciones**.
    
- **Propósito:** Permitir que el usuario **clasifique** sus transacciones con múltiples etiquetas, facilitando el filtrado, análisis y visualización por categorías.
    

---

### Relación con `TransaccionProgramada`

- **Relación:** `Etiqueta` 0..* --- 0..* `TransaccionProgramada`
    
- **Interpretación:** Igual que con `Transaccion`, una transacción programada puede estar asociada a varias etiquetas, o a ninguna.
    
- **Propósito:** Permitir **organizar futuras transacciones** desde el momento de su planificación. Esto refuerza el control y la previsibilidad en la gestión financiera.

## 🧩 **Rutas del recurso: Etiquetas (`/api/labels`)**

### **1️⃣ GET /api/labels**

**Descripción:**  
Obtiene la lista de etiquetas del usuario autenticado.  
Permite filtrar etiquetas mediante parámetros de consulta (`query params`).

**Ejemplo:**  
`GET /api/labels?nombre=alimentación&frecuencia=alta`

**Requiere autenticación:** ✅  
**Control:** el `usuarioId` se extrae del token JWT.

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Lista filtrada de etiquetas|Retorna un array con las etiquetas del usuario que cumplen los filtros.|
|400 Bad Request|Parámetros inválidos|Algún parámetro de filtro no es válido.|

---

### **2️⃣ POST /api/labels**

**Descripción:**  
Crea una nueva etiqueta asociada al usuario autenticado.

**Body (JSON):**

`{   "nombre": "Transporte",   "color": "#33B5E5" }`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|201 Created|Etiqueta creada correctamente|Devuelve la etiqueta creada con su `id`.|
|400 Bad Request|Datos inválidos|Falta `nombre` o formato incorrecto.|

---

### **3️⃣ PATCH /api/labels/:id/frecuencia/minus**

### **PATCH /api/labels/:id/frecuencia/plus**

**Descripción:**  
Actualiza la **frecuencia de uso** de una etiqueta (incrementa o reduce el contador).  
Se usa según la acción del usuario (por ejemplo, cuando usa o elimina la etiqueta en una transacción).

**Ejemplo:**  
`PATCH /api/labels/42/frecuencia/plus`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Frecuencia actualizada|Devuelve el nuevo valor de frecuencia.|
|400 Bad Request|Datos inválidos|El ID no es numérico o no pertenece al usuario.|
|404 Not Found|ID inexistente|No se encontró la etiqueta.|

---

### **4️⃣ DELETE /api/labels/:id**

**Descripción:**  
Elimina una etiqueta del usuario autenticado.

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|204 No Content|Eliminación exitosa|La etiqueta fue eliminada correctamente.|
|404 Not Found|ID inexistente|No existe la etiqueta o no pertenece al usuario.|


