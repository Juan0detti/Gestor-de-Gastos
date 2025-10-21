
El sistema desarrollado es una **aplicación web para la gestión de gastos personales**, diseñada para facilitar el **control financiero individual** mediante el registro, clasificación y análisis de transacciones e indicadores de progreso.

La aplicación permite al usuario **crear, editar y eliminar objetivos financieros**, registrar **ingresos y gastos**, y **asignar etiquetas personalizadas** a cada transacción para una mejor organización. Además, posibilita **programar transacciones futuras**, las cuales se convierten en reales al alcanzarse la fecha establecida, previa confirmación del usuario.

El sistema incorpora **validaciones automáticas** que garantizan la coherencia de los datos, evitando montos negativos, fechas incorrectas o duplicadas. También ofrece **visualizaciones del progreso de los objetivos** y **opciones de respaldo local de la información**, asegurando la preservación de los datos del usuario.

Desarrollada con **React**, la aplicación presenta una interfaz modular, dinámica y reutilizable, basada en almacenamiento local (`localStorage`). Su arquitectura facilita futuras integraciones con servicios externos o bases de datos, manteniendo una experiencia de uso intuitiva y eficiente.

---
## **Requerimientos del Sistema**

Los requerimientos del sistema definen las funciones, restricciones y características necesarias para el correcto funcionamiento del gestor de gastos personales. Estos se dividen en **requerimientos funcionales**, que describen las operaciones que el sistema debe realizar, y **requerimientos no funcionales**, que establecen los criterios de calidad, rendimiento y usabilidad.

### **Requerimientos funcionales:**

- El sistema debe poder registrar tanto gastos como ingresos(una transacción) del usuario.
    
- El sistema debe permitir editar una transacción registrada.
    
- El sistema debe permitir eliminar una transacción registrada.
    
- El sistema debe permitir al usuario registrar sus objetivos financieros para un determinado periodo de tiempo.
    
- El sistema debe permitir editar un objetivo financiero registrado.
    
- El sistema debe permitir eliminar un  objetivo financiero registrado.
    
- El sistema debe mostrar el progreso en el cumplimiento de un objetivo financiero.
    
- El sistema debe permitir al usuario programar una posible transacción.
    
- El sistema debe permitir al usuario confirmar la realización de una transacción programada.
    
- El sistema debe permitir editar una transacción programada registrada.
    
- El sistema debe permitir eliminar una transacción programada registrada.
    
- El sistema debe permitir crear una etiqueta personalizada.
    
- El sistema debe mostrar el saldo actual del usuario.

### **Requerimientos no  funcionales:**

- El usuario puede acceder desde el escritorio o dispositivo móvil.

Addición de nuevos reuqerimientos NO funcionales en la tercer iteración:
[[Universidad/DS/Documentación Proyecto/Documentación Requerimiento No funcionales y Seguridad.md]]

---
## **Modelado de Navegación y Casos de Uso**

Con el objetivo de representar la interacción del usuario con el sistema y describir las funcionalidades principales de la aplicación, se elaboraron los **diagramas BPMN** y los **Casos de Uso** correspondientes.

### **Modelado BPMN**

El **Business Process Model and Notation (BPMN)** se utilizó en este proyecto como una herramienta para **modelar la navegación del usuario a través de las distintas secciones del sistema**, en lugar de representar procesos de negocio tradicionales.

De esta forma, el diagrama BPMN permite visualizar el **flujo de interacción entre las pantallas y componentes** del gestor de gastos, mostrando cómo el usuario accede a las diferentes funciones de la aplicación, tales como:

- Ingreso al sistema y visualización de la **pantalla principal** con el resumen de objetivos y transacciones.
    
- **Navegación hacia la sección de objetivos**, donde puede crear, editar o eliminar metas financieras.
    
- **Acceso a la sección de transacciones**, donde se registran ingresos, gastos y transacciones programadas.
    
- Interacción con el **módulo de etiquetas**, que permite crear y administrar categorías personalizadas.
    

Este enfoque de modelado facilita una comprensión visual del **comportamiento general de la interfaz**, ayudando a definir la secuencia lógica de navegación y las acciones disponibles en cada etapa.

**
---
## **Diagramas de Casos de Uso**

Los **casos de uso** complementan el modelado de procesos, enfocándose en las **interacciones entre el actor principal (el usuario)** y el sistema.  
A través de estos diagramas se definen las **funcionalidades esenciales** y los **límites del sistema**, permitiendo identificar los requerimientos funcionales y no funcionales.

Entre los principales casos de uso se destacan:

- **Gestionar objetivos financieros.**
    
- **Registrar transacciones.**
    
- **Asignar y administrar etiquetas personalizadas.**
    
- **Programar transacciones futuras.**
    
- **Visualizar el progreso de los objetivos.**
    
- **Realizar respaldos de datos.**
    

Cada caso de uso describe el **propósito**, **flujo de eventos** y **condiciones de éxito**, estableciendo una base sólida para el diseño y la validación del sistema.

Los casos de uso se desarrollan a continuación:

https://docs.google.com/document/d/1m0WZeiQzC8lKo3vuSDzTVhAuNv3Iz6jIpQfh21i6SXU/edit?usp=sharing


___
### **Planificación del Proyecto**

A partir del **análisis de los Casos de Uso**, se llevó a cabo una **planificación detallada del desarrollo del sistema**, con el propósito de organizar las actividades identificadas, estimar los tiempos de ejecución y definir el orden lógico de implementación.  
Este proceso permitió traducir los requerimientos funcionales en un **conjunto de tareas estructuradas**, distribuidas por fases e iteraciones, asegurando una **gestión eficiente de los recursos** y el cumplimiento de los objetivos del proyecto dentro de los plazos establecidos.

Para ello, se aplicaron las metodologías **PERT (Program Evaluation and Review Technique)** y **CPM (Critical Path Method)**, las cuales permiten **estimar la duración esperada de cada actividad** e **identificar las tareas críticas** que determinan la duración total del proyecto.  
El análisis resultante sirvió como base para la **planificación temporal y la programación de las actividades**, garantizando un desarrollo ordenado y controlado del sistema.

![[Planificación.pdf]]
___

## Diagramas

A su vez, a partir del **análisis de los Casos de Uso**, se desarrollaron los **diagramas de diseño** que permitieron definir la estructura y comportamiento interno del sistema.  
Entre ellos se incluyen el **Diagrama de Clases**, que representa la organización lógica de las entidades y sus relaciones; el **Diagrama de Secuencia**, que muestra la interacción entre los componentes durante la ejecución de cada funcionalidad; y el **Diagrama Entidad–Relación (DER)**, que describe la estructura de datos utilizada para el almacenamiento y gestión de la información.

Estos diagramas proporcionaron una visión integral del sistema desde una perspectiva técnica, sirviendo como base para la **implementación y validación** del modelo propuesto.


[[Diagrama de clase]]

### Diagrama de Entidad-Relación

![[DC-DS-DER.drawio.png]]

## **Arquitectura**

Ver [[Arquitectura]]
## **Implementación**

La implementación del sistema se llevó a cabo utilizando un conjunto de herramientas y tecnologías modernas que permiten garantizar un desarrollo eficiente, modular y escalable. Cada componente se encuentra claramente separado en capas, promoviendo una arquitectura organizada y mantenible.

### Herramientas utilizadas

1. **React con Vite**: empleado para el desarrollo del _Front-End_ (Capa de Presentación), ofreciendo un entorno rápido y optimizado para la creación de interfaces dinámicas e interactivas.
    
2. **Axios**: utilizado para la gestión de peticiones HTTP dentro de la _Capa de Lógica de Presentación_, permitiendo la comunicación asíncrona con la API del sistema.
    
3. **Express.js**: framework utilizado en la _Capa de Negocio_ para la definición y gestión de las rutas de la API, facilitando la creación de servicios RESTful.
    
4. **Sequelize**: actuando como _Mapeador Objeto-Relacional (ORM)_, facilita la interacción entre el código del servidor y la base de datos, garantizando la integridad y consistencia de los datos.
	Para comprender el mapeo a una base PostgresSQL:
	https://sequelize.org/docs/v7/databases/postgres/
	https://sequelize.org/docs/v7/models/data-types/
	
5. **PostgreSQL**: empleado como _Base de Datos Relacional_ dentro de la _Capa de Datos_, proporcionando robustez, seguridad y eficiencia en el almacenamiento de la información.
    
6. **Firebase Authentification**: utilizado en la _Capa de Autenticación_, permitiendo la gestión segura de usuarios, sesiones y control de acceso al sistema.
    
### Despliegue

1. El **Front-End** y la **Capa de Lógica de Presentación** fueron desplegados en **Netlify**, aprovechando su integración continua y facilidad de despliegue desde repositorios.
    
2. El **Back-End**, desarrollado en Express, se encuentra alojado en **Render**, en un repositorio independiente de GitHub para mantener la separación entre cliente y servidor.
    
3. La **Base de Datos PostgreSQL** se implementó en la plataforma **Neon**, aprovechando su entorno en la nube optimizado para rendimiento y conexión segura con la API.