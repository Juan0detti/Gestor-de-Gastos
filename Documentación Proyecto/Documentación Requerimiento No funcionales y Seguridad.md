


<h2 align='center'>Requerimientos NO Funcionales </h2>
Todo sistema cuenta con requerimientos funcionalidades, por eso, esta sección se definirán los requerimientos no funcionales para el proyecto de **Gestor de Gastos**.
---

### 📱 Portabilidad - Multiplataforma

Para garantizar una experiencia fluida y coherente entre distintos dispositivos, **se establece como requerimiento no funcional la portabilidad del sistema**. La aplicación debe funcionar correctamente tanto en **navegadores web modernos** como en **dispositivos móviles** con sistema operativo **Android** en forma de aplicación. Esto permitirá que el usuario pueda **acceder a su información financiera desde cualquiera de sus dispositivos personales**, manteniendo la **sincronización** de los datos en todo momento.

Este requerimiento obliga a **replantear la arquitectura del sistema**, ya que se debe disponer de una **capa de presentación web** y otra **capa de presentación móvil (Android)**, ambas comunicándose con los mismos servicios de negocio y de datos para asegurar consistencia funcional.

**Condición de cumplimiento:**  
En ejecución dentro del sistema Android, la aplicación debe permitir al usuario hacer uso de **todas las funcionalidades disponibles en el entorno web**, sin restricciones en cuanto a gestión de información, operaciones financieras o visualización de datos.

### 🔒 Autenticación del Usuario

Con el objetivo de garantizar que los datos almacenados estén protegidos frente a accesos no autorizados, **se selecciona como requerimiento no funcional la seguridad basada en la autenticación del usuario**. Esta autenticación se llevará a cabo mediante servicios externos de Google, permitiendo inicio de sesión con **correo electrónico y contraseña**, y eventualmente utilizando **proveedores externos** como Google.

La necesidad de este requerimiento introduce una **capa de autenticación** en la arquitectura del sistema, independiente de la lógica de negocio, la cual se encargará de validar las credenciales y otorgar acceso seguro a las demás capas.

**Condición de cumplimiento:**  
En un entorno de ejecución normal, durante el **inicio de sesión o el registro**, el sistema debe contactar al **servicio externo de Google** para autenticar las credenciales del usuario. Una vez validado, el usuario podrá **conectarse a la base de datos y acceder a sus datos normalmente**, garantizando un acceso seguro y confiable a su información financiera personal.

**Diagrama simplificado:**

![[Pasted image 20250923022152.png]]

### 🔐 Protección de Datos

Para resguardar la privacidad y confidencialidad de la información financiera y personal del usuario, **se define como requerimiento no funcional la protección de los datos**. Toda la información gestionada por el sistema deberá estar protegida mediante **mecanismos de cifrado**, tanto **en tránsito** como **en reposo**.

Este requerimiento busca garantizar que, aun en situaciones de vulnerabilidad o uso compartido de dispositivos, los datos permanezcan **seguros y privados**, evitando accesos no autorizados o filtraciones.

___

##

<h2 align='center'>Seguridad</h2>

### Problemas comunes (vulnerabilidades y riesgos) y cómo mitigarlos

### 1. **Consultas seguras y prevención de inyección SQL**

- **Riesgo técnico:** La inyección SQL permite a un atacante manipular la consulta y acceder, modificar o borrar datos sensibles.
    
- **Contramedidas aplicadas:**
    
    - Uso de **consultas parametrizadas** en PostgreSQL con `$1`, `$2` en lugar de concatenación de strings. Ejemplo:
        
        `SELECT * FROM usuarios WHERE email = $1;`
        
    - Aplicación del principio de **mínimos privilegios**: el usuario de BD que usa la app tiene permisos limitados (solo `SELECT/INSERT/UPDATE` donde corresponde, sin `DROP` ni `ALTER`).
        
    - Monitoreo de consultas sospechosas con **logs de auditoría SQL**.

### 2. **Datos opcionales inseguros (XSS en campos como notas o descripción)**

- **Riesgo técnico:** Un atacante puede inyectar **JavaScript malicioso** en descripciones, afectando a otros usuarios.
    
- **Contramedidas aplicadas:**
    
    - Implementación de **validaciones en backend**: solo se permiten caracteres seguros (alfanuméricos y símbolos básicos).
        
    - Uso de librerías de **escape/encoding** al renderizar en frontend (`React` ya protege contra XSS al escapar valores dinámicos).
        
    - Desinfección adicional con librerías como **DOMPurify** si se admite HTML.

### 3. **Límites de tamaño y rango de entrada**

- **Riesgo técnico:** Inputs extremadamente grandes pueden generar **DoS** por consumo de memoria o CPU; expresiones mal diseñadas en regex permiten **ReDoS**.
    
- **Contramedidas aplicadas:**
    
    - Definición de **longitud máxima** en cada campo (ej: nombre de etiqueta ≤ 100 chars, descripción ≤ 500 chars).
        
    - Validación de rangos numéricos en backend (ej: montos ≥ 0 y dentro de un límite razonable, como ≤ 1e9).
        
    - Revisión y limitación de **expresiones regulares** para evitar patrones vulnerables a ataques exponenciales.

### 4. **Manejo de errores y fugas de información**

- **Riesgo técnico:** Mensajes de error detallados (stack traces, SQL errors) pueden revelar rutas internas, tablas, o estructuras de la app.
    
- **Contramedidas aplicadas:**
    
    - Configuración de **errores genéricos en producción**:
        
        - Usuario recibe → `"Ocurrió un error, inténtelo nuevamente"`
            
        - Servidor registra → log detallado con timestamp, usuario, endpoint, stack trace.
            
    - Uso de **sistemas centralizados de logging** (ej. Winston + PostgreSQL logs) con niveles (`info`, `warn`, `error`) para análisis seguro sin exponer info sensible.
### 5. **Control de acceso y autorización con autenticación de Google**

- **Riesgo técnico:** Aunque la identidad se valide con Google, si no se implementa una capa de autorización adecuada, un usuario podría intentar acceder a recursos de otro (p. ej. consultando transacciones de otra cuenta con un `id` distinto).
    
- **Contramedidas aplicadas:**
    
    - Uso de **OAuth2 / OpenID Connect**: la aplicación recibe un **ID Token** de Google, que contiene la identidad del usuario (correo, sub).
        
    - Validación en backend de la **firma y vigencia del token** mediante la librería oficial de Google o endpoints de verificación (`https://oauth2.googleapis.com/tokeninfo`).
        
    - Middleware de autorización: cada request valida que el token esté vigente y que el `sub` corresponda al dueño del recurso solicitado.
        
    - Registro de accesos y **auditoría de operaciones críticas** (ej. eliminación de objetivos, modificación de transacciones).