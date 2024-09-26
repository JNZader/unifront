# Gestión Educativa

Gestión Educativa es una aplicación web diseñada como trabajo final para la materia Desarrollo de Aplicaciones Web de la Universidad Gastón Dachary. Su objetivo es facilitar la administración de instituciones educativas, permitiendo gestionar estudiantes, cursos, inscripciones y profesores.
## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características

- **Gestión de Estudiantes**: Añadir, editar y eliminar información de estudiantes.
- **Gestión de Cursos**: Crear y gestionar cursos disponibles.
- **Inscripciones**: Permitir que los estudiantes se inscriban en los cursos.
- **Gestión de Profesores**: Añadir y gestionar información sobre los profesores.
- **Interfaz de Usuario Amigable**: Navegación intuitiva y fácil acceso a todas las secciones.

## Tecnologías Utilizadas

- **React**: Para la construcción de la interfaz de usuario.
- **Material-UI**: Para los componentes de diseño y estilo.
- **React Router**: Para la gestión de rutas en la aplicación.
- **JavaScript / TypeScript**: Lenguaje de programación principal.
- **Node.js**: Para el entorno de ejecución del servidor.

## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone
   ```

2. **Navegar al directorio del proyecto**:



3. **Instalar las dependencias**:

   ```bash
   npm install
   ```

4. **Iniciar la aplicación**:

   ```bash
   npm start
   ```

   La aplicación se ejecutará en `http://localhost:3000`.

## Uso

- Al iniciar la aplicación, verás una página de bienvenida con enlaces a las diferentes secciones: Estudiantes, Cursos, Inscripciones y Profesores.
- Navega a través de las secciones para gestionar la información de la institución.

## Estructura del Proyecto

La estructura de carpetas del proyecto es la siguiente:

```
gestión-educativa/
  ├── public/           # Archivos públicos (HTML, iconos, etc.)
  ├── src/              # Código fuente de la aplicación
  │   ├── components/    # Componentes de React
  │   ├── pages/         # Páginas de la aplicación
  │   ├── App.js         # Componente principal de la aplicación
  │   └── index.js       # Punto de entrada de la aplicación
  └── package.json       # Configuración del proyecto y dependencias
