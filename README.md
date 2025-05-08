# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# base-react-tailwind-vite
# universonomada-webclient

# Universo Nómada Web Client

Frontend para la aplicación Universo Nómada, una plataforma de gestión de viajes y destinos turísticos.

## Funcionalidades Principales

### Sistema de Testimonios

La aplicación cuenta con un sistema completo para la gestión de testimonios de clientes:

1. **Panel de Administración**:
   - Listado de testimonios con paginación
   - Formulario para crear nuevos testimonios
   - Edición de testimonios existentes
   - Eliminación de testimonios
   
2. **Visualización en Frontend**:
   - Sección dinámica en Home que muestra los testimonios más recientes
   - Carrusel interactivo para navegar entre testimonios
   - Visualización de imágenes de viajes y calificaciones

3. **Estructura de Datos**:
   - Nombre del cliente
   - Imagen de avatar (opcional)
   - Calificación (1-5 estrellas)
   - Texto del testimonio
   - Imágenes del viaje (opcional, múltiples)
   - Fecha de creación/actualización

## Estructura del Proyecto

- `/components`: Componentes reutilizables React
- `/pages`: Páginas principales de la aplicación
- `/services`: Servicios para comunicación con API
- `/assets`: Recursos estáticos (imágenes, etc.)

## Tecnologías Utilizadas

- React con TypeScript
- Tailwind CSS para estilos
- Framer Motion para animaciones
- React Router para la navegación
- Axios para peticiones HTTP
- React-Toastify para notificaciones

## Desarrollo

1. Instalar dependencias:
```
npm install
```

2. Iniciar servidor de desarrollo:
```
npm run dev
```

3. Construir para producción:
```
npm run build
```
