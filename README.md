🔗 URL del proyecto en producción: https://manu.cicloflorenciopintado.es

![image](https://github.com/user-attachments/assets/12a88737-6fe5-49f0-8c50-292e43561cf0)

# 🏖️ Marina Rent - Plataforma de alquiler de objetos de playa

BeachRent es una aplicación web desarrollada en **React** que permite alquilar objetos relacionados con la playa por hora y según el número de personas. El sistema está conectado a una API REST desarrollada con **Laravel**, y permite tanto a usuarios comunes como a administradores gestionar publicaciones y reservas.

## 🚀 Tecnologías utilizadas

- **Frontend**: React (Vite)
- **Backend**: Laravel API REST
- **Autenticación**: JWT o tokens Laravel Sanctum (según implementación)
- **Estilos**: TailwindCSS / CSS Modules / Styled Components (según tu stack)
- **Routing**: React Router
- **Manejo de estado**: React Context / Redux / Hooks personalizados (según tu stack)

## 🌐 API Base URL

La aplicación se comunica con el servidor a través de la siguiente URL base:

https://manu.cicloflorenciopintado.es/laravel/public/api/


## 📚 Estructura de la base de datos

La base de datos del proyecto consta de 3 tablas principales:

- **usuarios**: contiene la información de los usuarios registrados, incluyendo el rol (admin o usuario).
- **publicaciones**: objetos disponibles para alquilar (sombrillas, hamacas, tablas, etc.).
- **reservas**: registros de reservas con referencia al usuario, publicación, fecha, hora y número de personas.

## 🔐 Roles del sistema

- **Usuario común**:
  - Puede registrarse e iniciar sesión.
  - Puede ver las publicaciones disponibles.
  - Puede realizar reservas por hora y por número de personas.
  - Puede gestionar sus propias reservas.

- **Administrador**:
  - Accede a un panel de administración.
  - Puede crear, editar y eliminar publicaciones.
  - Puede ver todas las reservas.
  - Puede gestionar usuarios si está habilitado.

## 📦 Instalación

1. **Clona el repositorio**:

```bash
git clone https://github.com/tu-usuario/beachrent.git
cd beachrent
````
2. **Instala las dependencias**:
   
```bash
npm install
````
3. **Configura las variables de entorno**:

```bash
const URLSERVER = "https://manu.cicloflorenciopintado.es/laravel/";
export const API_URL = URLSERVER+"public/"
export const IMAGE_URL = URLSERVER+"storage/app/public/photos/";
````
4. **Ejecuta la Aplicacion**:
   
```bash
npm run dev
````
