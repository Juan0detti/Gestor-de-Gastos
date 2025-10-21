<h2 align='center'>Introducción</h2>

La clase `TransaccionProgramada` representa una operación financiera futura que el usuario desea registrar automáticamente en el sistema en una **fecha y hora específica**. Puede tratarse de un **ingreso** o un **gasto** planificado, como el pago de suscripciones, servicios o la recepción de ingresos regulares.

Su función principal es permitir al sistema realizar una **gestión anticipada de las finanzas**, ofreciendo **recordatorios** y **automatización** del registro de transacciones reales. Al llegar la fecha y hora programada, el sistema notifica al usuario y, tras su confirmación, **convierte la transacción programada en una transacción real**, copiando todos sus atributos menos la hora.

La clase está asociada a `Usuario`, `Etiqueta` y `Objetivo`, permitiendo al usuario **organizar, clasificar y planificar** su economía personal con precisión.

<h2 align='center'>Clase</h2>

| Transacciones Programadas                                                                                  |
| ---------------------------------------------------------------------------------------------------------- |
| - string título  <br>- int monto  <br>- Date fecha (con hora)  <br>- string tipo  <br>- string descripcion |

## Capa de Datos o Persistencia
```javascript
// /TransaccionProgramadaRepository.js

export class TransaccionProgramadaRepository {
  static #CLAVE = 'transaccionesProgramadas';

  static obtenerTodas() {
    return JSON.parse(localStorage.getItem(this.#CLAVE)) || [];
  }

  static guardarTodas(transaccionesProgramadas) {
    localStorage.setItem(this.#CLAVE, JSON.stringify(transaccionesProgramadas));
  }
}
```

## Capa de Dominio o Negocio
```javascript
export class TransaccionProgramada {
  constructor(nombre, monto, fechaHora, tipo, descripcion = '', etiquetas = []) {
    const errores = TransaccionProgramada.validarDatos(monto, fechaHora);
    if (Object.keys(errores).length > 0) {
      throw new Error('Datos inválidos: ' + JSON.stringify(errores));
    }

    this.id = uuidv4();
    this.nombre = nombre;
    this.monto = monto;
    this.fechaHora = fechaHora; // con hora
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.etiquetas = etiquetas;
  }

  static validarDatos(monto, fechaHora) {
    const errores = {};
    if (!fechaHora) errores.fechaHora = "La fecha y hora son obligatorias.";
    else if (new Date(fechaHora) < new Date()) errores.fechaHora = "La fecha debe ser futura.";

    if (!monto && monto !== 0) errores.monto = "El monto es obligatorio.";
    else if (parseFloat(monto) < 0) errores.monto = "El monto no puede ser negativo.";

    return errores;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      monto: this.monto,
      fechaHora: this.fechaHora,
      tipo: this.tipo,
      descripcion: this.descripcion,
      etiquetas: this.etiquetas
    };
  }

  static guardar(tp) {
    const todas = TransaccionProgramadaRepository.obtenerTodas();
    todas.push(tp.toJSON());
    TransaccionProgramadaRepository.guardarTodas(todas);
  }

  static todas() {
    return TransaccionProgramadaRepository.obtenerTodas();
  }

  static eliminar(id) {
    const trans = TransaccionProgramadaRepository.obtenerTodas();
    const filtradas = trans.filter(t => t.id !== id);
    TransaccionProgramadaRepository.guardarTodas(filtradas);
    return filtradas;
  }

  static editar(id, nuevosDatos) {
    const trans = TransaccionProgramadaRepository.obtenerTodas();
    const actualizadas = trans.map(t => t.id === id ? { ...t, ...nuevosDatos } : t);
    TransaccionProgramadaRepository.guardarTodas(actualizadas);
  }

  // Método para obtener y ejecutar las vencidas
  static procesarVencidas(callbackConfirmacion) {
    const ahora = new Date();
    const trans = TransaccionProgramadaRepository.obtenerTodas();
    const restantes = [];
    for (let t of trans) {
      const fecha = new Date(t.fechaHora);
      if (fecha <= ahora) {
        const confirmar = callbackConfirmacion(t);
        if (confirmar) {
          const fechaSinHora = fecha.toISOString().split("T")[0];
          const transReal = {
            nombre: t.nombre,
            monto: t.monto,
            fecha: fechaSinHora,
            tipo: t.tipo,
            descripcion: t.descripcion,
            etiquetas: t.etiquetas
          };
          Transaccion.guardar(new Transaccion(
            transReal.nombre,
            transReal.monto,
            transReal.fecha,
            transReal.tipo,
            transReal.descripcion,
            transReal.etiquetas
          ));
        } else {
          restantes.push(t);
        }
      } else {
        restantes.push(t);
      }
    }
    TransaccionProgramadaRepository.guardarTodas(restantes);
  }
}
```

## Capa de Servicio o Lógica
```javascript
export class TransaccionProgramadaService {
  static crearYGuardar(nombre, monto, fechaHora, tipo, descripcion = '', etiquetas = []) {
    const errores = TransaccionProgramada.validarDatos(monto, fechaHora);
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }

    const tp = new TransaccionProgramada(nombre, monto, fechaHora, tipo, descripcion, etiquetas);
    TransaccionProgramada.guardar(tp);
    return { ok: true, transaccionProgramada: tp };
  }

  static obtenerTodas() {
    return TransaccionProgramada.todas();
  }

  static eliminar(id) {
    return TransaccionProgramada.eliminar(id);
  }

  static editar(id, nuevosDatos) {
    const errores = TransaccionProgramada.validarDatos(nuevosDatos.monto, nuevosDatos.fechaHora);
    if (Object.keys(errores).length > 0) {
      return { ok: false, errores };
    }
    TransaccionProgramada.editar(id, nuevosDatos);
    return { ok: true };
  }

  static procesarVencidas(callbackConfirmacion) {
    TransaccionProgramada.procesarVencidas(callbackConfirmacion);
  }
}
```

## Capa de Presentación
```javascript
// Lógica para revisar periódicamente si hay transacciones programadas vencidas
TransaccionProgramadaService.procesarVencidas(tp => {
  return confirm(`¿Deseas registrar la transacción programada "${tp.nombre}" de $${tp.monto}?`);
});
```
##

<h2 align='center'>Relaciones</h2>

### **Usuario**

- **Multiplicidad:** `Usuario` 1 ─── 0..* `TransaccionProgramada`
    
- **Interpretación:** Cada transacción programada está vinculada a un único usuario, mientras que un usuario puede tener múltiples transacciones programadas.
    
- **Propósito:** Permite planificar eventos financieros recurrentes o futuros personalizados.
    

---

### **Etiqueta**

- **Multiplicidad:** `TransaccionProgramada` 0..* ─── 0..* `Etiqueta`
    
- **Relación:** Muchos a muchos.
    
- **Propósito:** Clasificar y etiquetar transacciones futuras de forma anticipada.

## ⏰ **Rutas del recurso: Transacciones Programadas (`/api/scheduled-transactions`)**

### **1️⃣ GET /api/scheduled-transactions**

**Descripción:**  
Obtiene todas las transacciones programadas del usuario autenticado.

**Ejemplo:**  
`GET /api/scheduled-transactions`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Lista de transacciones programadas|Devuelve todas las transacciones pendientes, activas o repetitivas del usuario.|

---

### **2️⃣ GET /api/scheduled-transactions?prop1=val1&prop2=val2**

**Descripción:**  
Filtra las transacciones programadas mediante parámetros de consulta.

**Ejemplo:**  
`GET /api/scheduled-transactions?estado=pendiente&tipo=gasto&etiqueta=servicios`

**Parámetros comunes:**

|Parámetro|Tipo|Descripción|
|---|---|---|
|`tipo`|string|“ingreso” o “gasto”.|
|`estado`|string|“pendiente”, “confirmada”, “cancelada”.|
|`fechaInicio` / `fechaFin`|string (ISO)|Rango de fechas programadas.|
|`etiqueta`|string|Filtro por etiqueta.|

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Lista filtrada|Devuelve solo las transacciones que cumplen los filtros.|
|400 Bad Request|Parámetros inválidos|Algún filtro tiene formato incorrecto.|

---

### **3️⃣ POST /api/scheduled-transactions**

**Descripción:**  
Crea una nueva transacción programada.

**Body (JSON):**

`{   "tipo": "gasto",   "monto": 10000,   "descripcion": "Pago de alquiler",   "fecha_programada": "2025-11-01",   "repeticion": "mensual",   "etiquetas": ["hogar"] }`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|201 Created|Transacción programada creada|Devuelve el objeto creado.|
|400 Bad Request|Datos inválidos|Falta o formato incorrecto de campos requeridos.|

---

### **4️⃣ PUT /api/scheduled-transactions/:id**

**Descripción:**  
Actualiza una transacción programada.

**Body (JSON):**

`{   "monto": 10500,   "descripcion": "Pago de alquiler actualizado" }`

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Transacción actualizada|Devuelve el nuevo objeto.|
|400 Bad Request|Datos inválidos|Campos con formato incorrecto.|
|404 Not Found|ID inexistente|No se encontró o no pertenece al usuario.|

---

### **5️⃣ DELETE /api/scheduled-transactions/:id**

**Descripción:**  
Elimina una transacción programada.

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|204 No Content|Eliminación exitosa|Transacción eliminada correctamente.|
|404 Not Found|ID inexistente|No se encontró la transacción o no pertenece al usuario.|

---

### **6️⃣ PATCH /api/scheduled-transactions/:id/confirm**

**🆕 Descripción (ruta adicional):**  
Confirma una transacción programada cuando llega su fecha, convirtiéndola en una transacción real.  
También puede cambiar su estado a “confirmada”.

**Ejemplo:**  
`PATCH /api/scheduled-transactions/45/confirm`

**Comportamiento sugerido:**

- Se crea una **transacción real** en `/api/transactions` basada en los datos de la programada.
    
- Se actualiza el **estado** de la transacción programada a `confirmada`.
    
- Puede incluir confirmación manual del usuario (por ejemplo, mediante un botón en el frontend).
    

**Respuestas:**

|Código|Significado|Descripción|
|---|---|---|
|200 OK|Confirmación exitosa|Devuelve la transacción confirmada o el objeto creado en `/api/transactions`.|
|400 Bad Request|No se puede confirmar|La transacción no está lista para ser confirmada.|
|404 Not Found|ID inexistente|No existe la transacción programada o no pertenece al usuario.|