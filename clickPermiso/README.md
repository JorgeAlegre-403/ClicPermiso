# ClicPermiso - Sistema de Gestión de Ausencias

Una aplicación web moderna para digitalizar y optimizar el flujo de trabajo de ausencias del profesorado en el IES Albarregas.

## 🎯 Características

### Para Docentes
- **Panel Principal**: Consulta en tiempo real los días de asuntos personales disponibles
- **Solicitar Días**: Formulario intuitivo para solicitar permisos con documentación adjunta
- **Historial de Solicitudes**: Visualiza el estado completo de tus permisos (recibida, aprobada, denegada)
- **Notificaciones en Tiempo Real**: Recibe notificaciones automáticas cuando tu solicitud cambia de estado
- **Perfil**: Gestiona tu información corporativa y laboral

### Para Equipo Directivo
- **Panel de Administración**: Vista general de solicitudes pendientes, aprobadas y rechazadas
- **Calendario Global**: Visualiza todas las ausencias del centro para planificar coberturas
- **Gestor de Solicitudes**: Aprueba o rechaza solicitudes de forma individual o masiva
- **Descarga de Documentación**: Accede a los justificantes adjuntos por los docentes
- **Directorio**: Listado completo del claustro con información de contacto

## 🚀 Instalación y Setup

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Una cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd clickPermiso
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Supabase**
   - Consulta [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para crear las tablas necesarias
   - Obtén tu URL y anon key de Supabase

4. **Crear archivo .env.local**
   ```
   VITE_SUPABASE_URL=tu_url_aqui
   VITE_SUPABASE_ANON_KEY=tu_key_aqui
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

6. **Build para producción**
   ```bash
   npm run build
   ```

## 📋 Requisitos del Proyecto

### Login y Autenticación
- ✅ Formulario de acceso con autenticación por rol
- ✅ Checkbox obligatorio de consentimiento RGPD
- ✅ Sesiones seguras con Supabase Auth

### Vistas Docente
- ✅ Dashboard con días disponibles/consumidos/en tramitación
- ✅ Formulario para solicitar días con validaciones
- ✅ Historial completo de solicitudes con filtros
- ✅ Notificaciones en tiempo real de cambios de estado
- ✅ Perfil editable

### Vistas Directivo
- ✅ Dashboard con estadísticas generales
- ✅ Calendario global de ausencias con detalles por día
- ✅ Gestor de solicitudes con aprobación/rechazo individual y masiva
- ✅ Descarga de documentos justificativos
- ✅ Directorio del claustro

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: Zustand
- **Routing**: React Router v7
- **Icons**: React Icons
- **Storage**: Supabase Storage

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── ui/          # Componentes de UI básicos
│   ├── Header.tsx   # Encabezado con usuario
│   ├── Sidebar.tsx  # Navegación lateral
│   └── ProtectedRoute.tsx  # Protección de rutas
├── pages/           # Páginas de la aplicación
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── DashboardDocente.tsx
│   ├── SolicitarDias.tsx
│   ├── MisSolicitudes.tsx
│   ├── GestionSolicitudes.tsx
│   ├── CalendarioGlobal.tsx
│   ├── Profesores.tsx
│   └── Perfil.tsx
├── stores/          # Estado global (Zustand)
│   ├── authStore.ts
│   └── toastStore.ts
├── hooks/           # Hooks personalizados
│   └── useRealtimeNotifications.ts
├── types/           # Tipos TypeScript
│   └── index.ts
├── App.tsx          # Componente principal
└── main.tsx         # Punto de entrada
```

## 🔒 Seguridad

- Autenticación con Supabase Auth
- Row Level Security (RLS) en base de datos
- Validación de roles en frontend y backend
- Consentimiento RGPD explícito
- Protección de rutas por rol

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 💻 Computadoras de escritorio
- 📱 Tablets
- 📲 Smartphones

## 🔄 Notificaciones en Tiempo Real

Las suscripciones a cambios en tiempo real de Supabase permiten:
- Actualización automática del calendario cuando se aprueba/rechaza una solicitud
- Notificaciones en toast del docente cuando su solicitud cambia de estado
- Actualización del panel principal cuando hay cambios

## 🚢 Deployment

El proyecto está preparado para desplegarse en:
- Vercel
- Netlify
- Cualquier servidor compatible con Node.js

```bash
npm run build
# Sube la carpeta dist/
```

## 📝 Notas de Desarrollo

- Los días de asuntos personales se contabilizan como máximo 6 por curso escolar
- Los permisos no retribuidos no descuentan de los días disponibles
- Las validaciones de fechas previenen solicitudes retroactivas
- El teléfono debe tener exactamente 9 dígitos

## 🤝 Contribución

Para contribuir al proyecto:
1. Crea una rama con tu feature
2. Commiteai tus cambios
3. Push a la rama
4. Abre un Pull Request

## 📞 Soporte

Para reportar bugs o solicitar features, contacta con el equipo de desarrollo.

## 📄 Licencia

Este proyecto es propiedad del IES Albarregas.

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2026
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
