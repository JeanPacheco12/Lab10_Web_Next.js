# Laboratorio: Next.js App Router, Server Components & Optimistic UI

## Descripción del Proyecto
En este laboratorio donde tenemos una plataforma de gestión de eventos que llamaremos **EventPass** y que se desarrolló con **Next.js 16**. El objetivo principal del lab fue implementar patrones avanzados de manejo de datos, filtrado eficaz mediante la URL y una experiencia de usuario (UX) fluida haciendo uso de actualizaciones optimistas en pestañas dinámicas.

## Tecnologías Utilizadas
* **Framework:** Next.js 16 (App Router) 
* **Lenguaje:** TypeScript
* **UI Components:** Tailwind CSS & Lucide React
* **Estado Optimista:** React 19 Hooks (`useOptimistic`, `useTransition`) 
* **Validación:** Zod (Server-side validation) 

## Características Implementadas

### Parte 1: Filtrado Dinámico con URL State
Se implementó un sistema de filtros (Categoría, Estado, Precio y Búsqueda) que sincroniza el estado de la interfaz con los `searchParams` de la URL. 
* **Navegación sin recarga:** Uso de `useRouter` y `usePathname` para actualizar la URL de forma fluida. 
* **Persistencia:** Al recargar la página, los filtros se mantienen gracias a la lectura de los parámetros desde el servidor. 

### Parte 2: Registro Optimista (Optimistic UI)
Implementación del hook `useOptimistic` en el proceso de registro a eventos para proporcionar feedback instantáneo. 
* **Feedback Inmediato:** El contador de plazas disminuye visualmente antes de que el servidor confirme la operación. 
* **Manejo de Transiciones:** Uso de `useTransition` para gestionar estados de carga ("Registrando...") y deshabilitar acciones concurrentes. 
* **Revalidación de Caché:** Uso de `revalidatePath` para asegurar que los datos estén frescos en todas las rutas tras una mutación. 

## Video Explicativo
Puedes ver la explicación detallada del funcionamiento y el código en el siguiente enlace:
[Link al video del Laboratorio]
