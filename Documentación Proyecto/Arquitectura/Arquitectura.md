Se adoptó una arquitectura por capas, con el propósito de organizar el sistema de forma estructurada y facilitar su mantenimiento y evolución a largo plazo. Esta arquitectura divide la aplicación en diferentes niveles de responsabilidad, permitiendo separar claramente la lógica del negocio de la interfaz de usuario, y promover así un desarrollo más limpio, escalable y sostenible. Actualmente, el sistema ya cuenta con una separación inicial entre las capas de presentación, lógica de negocio y acceso a datos. Sin embargo, como parte de la planificación para futuras iteraciones, estas capas se formalizarán de la siguiente manera: 

1. Capa de Presentación : encargada de mostrar la interfaz visual al usuario e interpretar sus acciones (formularios, botones, navegación). Esta capa no contiene lógica de negocio ni accede directamente a los datos.

2. Capa de Servicios o Lógica de Presentación : constituida por funciones específicas que gestionan las peticiones HTTP hacia el backend, transforman los datos si es necesario y manejan errores de comunicación.
3. Capa de Negocio : responsable de procesar las peticiones recibidas, aplicar las reglas de negocio, validar datos y coordinar las operaciones con la base de datos. Es el núcleo lógico del sistema.
4. Capa de Datos : encargada del almacenamiento persistente, consulta, actualización y eliminación de la información, garantizando su integridad y disponibilidad controlada únicamente a través del backend.

## Definición API REST

A partir del **Diagrama de Clases** y de los **procesos descritos en los Casos de Uso**, se llevó a cabo la **definición de las rutas de la API**, estableciendo la estructura lógica para la comunicación entre el frontend y el backend del sistema.  
Cada ruta fue diseñada para representar una operación específica sobre las entidades principales, garantizando la coherencia entre la arquitectura del sistema y la funcionalidad esperada.  
De esta forma, se aseguró que las acciones identificadas en los Casos de Uso —como la creación, modificación, consulta y eliminación de datos— se correspondieran directamente con los métodos implementados en la API.


![[Ahorros#🏦 **Rutas del recurso Ahorros (`/api/saves`)**]]

![[Etiquetas#🧩 **Rutas del recurso Etiquetas (`/api/labels`)**]]

![[Objetivos#🎯 **Rutas del recurso Objetivos (`/api/goals`)**]]

![[Transacciones#💰 **Rutas del recurso Transacciones (`/api/transactions`)**]]

![[Transacciones Programas#⏰ **Rutas del recurso Transacciones Programadas (`/api/scheduled-transactions`)**]]