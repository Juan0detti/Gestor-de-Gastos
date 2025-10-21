<h2 align='center'>Introducción</h2>

La clase `Usuario` representa a una persona que utiliza el sistema de gestión financiera. Cada usuario tiene acceso individual a sus transacciones, etiquetas, objetivos, y configuraciones personales.

Para garantizar la seguridad, la persistencia y la escalabilidad del sistema, el registro e inicio de sesión se gestionan a través de **Firebase Authentication**, permitiendo una autenticación robusta mediante **correo electrónico y contraseña**.

Una vez autenticado, el sistema utiliza el **`uid` único provisto por Firebase** para identificar al usuario y asociar sus datos de forma aislada, asegurando privacidad y personalización en un entorno multiusuario.

---

<h2 align='center'>Clase</h2>

| Usuario                                                |
| ------------------------------------------------------ |
| - string uid  <br>- string email  <br>- Date creado_en |


## Capa de Datos o Persistencia

> En este caso, la gestión de usuarios se delega a **Firebase Authentication**, por lo tanto **no es necesario implementar un `UsuarioRepository`** a menos que quieras almacenar datos adicionales en `localStorage` o `Firestore`.
##
<h2 align='center'>Relaciones</h2>

### **Transacción**

- **Multiplicidad:** `Usuario` 1 ─── 0..* `Transaccion`
    
- **Interpretación:** Cada transacción registrada pertenece a un único usuario.
    
- **Propósito:** Permitir la gestión personalizada de operaciones financieras para cada persona.
    

---

### **Etiqueta**

- **Multiplicidad:** `Usuario` 1 ─── 0..* `Etiqueta`
    
- **Interpretación:** Cada usuario define su propio conjunto de etiquetas.
    
- **Propósito:** Clasificar las transacciones de forma flexible según criterios personales.
    

---

### **Transacción Programada**

- **Multiplicidad:** `Usuario` 1 ─── 0..* `TransaccionProgramada`
    
- **Interpretación:** Cada planificación financiera futura está asociada a un único usuario.
    
- **Propósito:** Automatizar y anticipar movimientos financieros personales.
    

---

### **Objetivo**

- **Multiplicidad:** `Usuario` 1 ─── 0..* `Objetivo`
    
- **Interpretación:** Cada objetivo financiero es creado y gestionado por un solo usuario.
    
- **Propósito:** Establecer metas financieras individuales y medir su progreso.
    

---

### **Ahorro**

- **Multiplicidad:** `Usuario` 1 ─── 0..* `Ahorro`
    
- **Interpretación:** Cada ahorro está exclusivamente vinculado a un usuario.
    
- **Propósito:** Permitir que cada persona registre y controle sus fondos de ahorro de manera separada de otros usuarios.

