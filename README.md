# Clínica OncoLogic - Frontend

Sistema de gestión para clínica oncológica desarrollado con React + TypeScript + Vite.

## 🚀 Tecnologías

- **React 18** con TypeScript
- **Vite** como build tool
- **React Router DOM** para navegación
- **Redux Toolkit + RTK Query** para estado global
- **Tailwind CSS** para estilos
- **Axios** para HTTP requests
- **ESLint + Prettier** para calidad de código
- **Husky** para git hooks

## Authors

- Santiago Valencia - A00395902
- Juan Manuel Díaz - A00394477
- Esteban Gaviria - A00396019

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base (Button, Input, Modal, etc.)
│   ├── forms/           # Formularios específicos del dominio
│   ├── tables/          # Componentes de tablas reutilizables
│   └── layout/          # Layout components (Header, Sidebar, etc.)
├── pages/               # Páginas de la aplicación
│   ├── auth/            # Autenticación (Login, etc.)
│   ├── dashboard/       # Dashboard principal
│   ├── patients/        # Gestión de pacientes
│   ├── appointments/    # Gestión de citas médicas
│   ├── staff/           # Gestión de personal
│   │   ├── doctors/     # Doctores
│   │   ├── administrative/ # Personal administrativo
│   │   └── specialities/ # Especialidades médicas
│   ├── laboratory/      # Laboratorio
│   │   ├── examinations/ # Exámenes médicos
│   │   └── results/     # Resultados de exámenes
│   └── administration/ # Administración del sistema
│       ├── users/       # Gestión de usuarios
│       └── roles/       # Gestión de roles
├── hooks/               # Custom React hooks
├── services/           # Servicios de API y utilidades
│   ├── api/            # Configuración de Axios y endpoints
│   └── auth/           # Servicios de autenticación
├── store/              # Redux store
│   └── slices/         # Redux slices
├── types/              # Definiciones de TypeScript
│   ├── api/            # Tipos para APIs
│   └── auth/           # Tipos para autenticación
├── utils/              # Funciones utilitarias
├── constants/          # Constantes de la aplicación
└── assets/             # Recursos estáticos
    ├── images/         # Imágenes
    └── icons/          # Iconos
```

## 🏗️ Arquitectura

### Componentes

- **UI Components**: Componentes base reutilizables (botones, inputs, modales)
- **Form Components**: Formularios específicos para cada entidad del dominio
- **Table Components**: Tablas reutilizables con paginación, filtros, etc.
- **Layout Components**: Estructura general de la aplicación

### Páginas

Organizadas por dominio funcional:

- **Auth**: Manejo de autenticación
- **Dashboard**: Panel principal con métricas
- **Patients**: CRUD de pacientes e historiales médicos
- **Appointments**: Gestión de citas médicas
- **Staff**: Gestión de personal (doctores, administrativos, especialidades)
- **Laboratory**: Exámenes y resultados de laboratorio
- **Administration**: Gestión de usuarios y roles del sistema

### Estado Global

- **Redux Toolkit** para manejo de estado complejo
- **RTK Query** para cache de datos de API
- **React Context** para autenticación

### Servicios

- **API Services**: Configuración centralizada de Axios
- **Auth Services**: Manejo de tokens JWT y autenticación

## 🔧 Instalación y Configuración

1. Clonar el repositorio
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar variables de entorno:

   ```bash
   cp .env.example .env
   # Editar .env con la configuración local
   ```

4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Ejecutar ESLint
- `npm run lint:fix` - Arreglar problemas de ESLint automáticamente
- `npm run format` - Formatear código con Prettier
- `npm run type-check` - Verificar tipos de TypeScript

## 🔐 Autenticación y Autorización

El sistema implementa autenticación basada en JWT con los siguientes roles:

- **ADMIN**: Acceso completo al sistema
- **DOCTOR**: Acceso a pacientes, citas, historiales
- **ADMINISTRATIVE**: Acceso limitado según permisos
- **PATIENT**: Acceso solo a su información personal

### Rutas Protegidas

Las rutas están protegidas por roles usando el componente `ProtectedRoute`:

```tsx
<ProtectedRoute roles={["ADMIN", "DOCTOR"]}>
  <PatientsPage />
</ProtectedRoute>
```

## 🎨 Estilos y UI

### Tailwind CSS

Utilizamos Tailwind CSS con un sistema de colores personalizado:

- **Primary**: Azules para acciones principales
- **Secondary**: Grises para elementos secundarios
- **Success**: Verde para estados exitosos
- **Warning**: Amarillo para advertencias
- **Error**: Rojo para errores

### Componentes UI

Todos los componentes UI son accesibles y siguen las mejores prácticas:

- Soporte para screen readers
- Navegación por teclado
- Estados de focus visibles
- Contraste de colores adecuado

## 🧪 Pruebas

```bash
# Ejecutar pruebas
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Coverage de pruebas
npm run test:coverage
```

## 🚀 Despliegue

El proyecto está configurado para despliegue en Tomcat (requerimiento del taller):

```bash
# Build para producción
npm run build

# Los archivos se generan en /dist
# Copiar contenido de /dist al servidor Tomcat
```

## 🔄 Integración con Backend

La aplicación se conecta al backend Spring Boot a través de:

- **Base URL**: `http://localhost:8080/api`
- **Autenticación**: JWT tokens en headers
- **Interceptores**: Manejo automático de tokens y errores

### Endpoints Principales

- `POST /api/auth/login` - Autenticación
- `GET /api/users/patients` - Obtener pacientes
- `POST /api/medical-appointments` - Crear citas
- `GET /api/doctors` - Obtener doctores
- Y muchos más...

## 📋 Convenciones de Código

- **Naming**: camelCase para variables, PascalCase para componentes
- **Files**: kebab-case para archivos, PascalCase para componentes
- **Imports**: Absolute imports usando aliases (@/...)
- **Types**: Interfaces con sufijo "Interface" si es necesario

## 📄 Licencia

Este proyecto es privado y confidencial.
