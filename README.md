# OncoLogic Clinic - Frontend

A comprehensive medical clinic management system designed specifically for oncology practices, built with modern React technologies.

### Authors

- [Santiago Valencia](https://github.com/Tiago0507)
- [Juan Manuel Díaz](https://github.com/Juanmadiaz45)
- [Esteban Gaviria](https://github.com/EstebanGZam)

## 🖼️ Application Screenshots

![Welcome Dashboard](/public/images/image-3.png)
_Main dashboard with role-based navigation and quick access to key features_

![Patient Registration](/public/images/image-1.png)
_Comprehensive patient registration form with medical history integration_

![Admin Panel](/public/images/image-2.png)
_Administrative dashboard with system management capabilities_

![Administrative Staff Panel](/public/images/image-4.png)
_Specialized interface for administrative personnel_

![Patient Management](/public/images/image-5.png)
_Advanced patient listing with search, filters, and pagination_

![Medical Appointment Creation](/public/images/image-6.png)
_Intuitive appointment scheduling system with conflict detection_

![Doctor Dashboard](/public/images/image-7.png)
_Doctor's workspace with patient management and medical records_

## 🚀 Technology Stack

### Core Technologies

- **React 18** with TypeScript for type-safe component development
- **Vite** as build tool and development server
- **React Router DOM v7** for client-side routing
- **Redux Toolkit** with RTK Query for state management and API caching
- **Axios** with custom interceptors for HTTP requests
- **Tailwind CSS** with custom design system

### Developer Experience

- **ESLint** with TypeScript rules and React hooks plugin
- **Prettier** for consistent code formatting
- **Husky** with pre-commit and pre-push hooks
- **TypeScript 5.8** with strict mode enabled
- **Vite** with Hot Module Replacement (HMR)

### UI/UX Libraries

- **@headlessui/react** for accessible, unstyled UI components
- **@heroicons/react** for consistent iconography
- **Custom Tailwind components** for design consistency

## 👥 Development Team

- **Santiago Valencia** - A00395902
- **Juan Manuel Díaz** - A00394477
- **Esteban Gaviria** - A00396019

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── components/           # Reusable React components
│   ├── ui/              # Base components (Button, Input, Modal, etc.)
│   ├── forms/           # Domain-specific forms
│   ├── tables/          # Reusable table components with pagination
│   └── layout/          # Layout components (Header, Sidebar, etc.)
├── pages/               # Application pages
│   ├── auth/            # Authentication (Login, Register, etc.)
│   ├── dashboard/       # Role-based dashboards
│   ├── patients/        # Patient management
│   ├── appointments/    # Medical appointment scheduling
│   ├── staff/           # Staff management
│   │   ├── doctors/     # Doctor management
│   │   ├── administrative/ # Administrative staff
│   │   └── specialities/ # Medical specialties
│   ├── laboratory/      # Laboratory management
│   │   ├── examinations/ # Medical examinations
│   │   └── results/     # Test results
│   └── administration/ # System administration
│       ├── users/       # User management
│       └── roles/       # Role management
├── hooks/               # Custom React hooks
├── services/           # API services and utilities
│   ├── api/            # Axios configuration and API client
│   └── auth/           # Authentication services with JWT
├── store/              # Redux store configuration
│   └── slices/         # Redux Toolkit slices
├── types/              # TypeScript type definitions
│   ├── core/           # Core types (API, forms, UI)
│   ├── auth/           # Authentication types
│   └── patients/       # Patient-related types
├── utils/              # Utility functions
├── constants/          # Application constants
│   ├── api/            # API endpoints and configuration
│   ├── app/            # Application constants
│   ├── auth/           # Authentication constants
│   ├── enums/          # Enumerated types
│   └── formats/        # Date and format constants
└── assets/             # Static assets
    ├── images/         # Image files
    └── icons/          # Icon files
```

## ⚙️ Key Features

### Authentication & Authorization

- **JWT-based authentication** with automatic token refresh
- **Role-based access control** (RBAC) with four distinct roles:
  - **ADMIN**: Full system access and configuration
  - **DOCTOR**: Patient care, medical records, appointments
  - **ADMINISTRATIVE**: Patient registration, appointment scheduling
  - **PATIENT**: Personal medical information access
- **Protected routes** with role validation
- **Session management** with automatic logout on token expiration

### Medical Management

- **Comprehensive patient profiles** with medical history
- **Appointment scheduling system** with conflict detection
- **Medical examination tracking** and results management
- **Laboratory test integration** with result tracking
- **Medical staff speciality management**

### Technical Features

- **Responsive design** optimized for desktop and mobile
- **Real-time form validation** with TypeScript integration
- **Advanced search and filtering** across all data entities
- **Pagination and sorting** for large datasets
- **File upload capabilities** for medical documents
- **Data export functionality** for reports
- **Comprehensive error handling** with user-friendly messages

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Git for version control

### Development Setup

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd oncologic-clinic-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment configuration**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   VITE_API_BASE_URL=http://localhost:8080/g5/siscom/api
   VITE_APP_NAME=OncoLogic Clinic
   VITE_NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:3000`

## 📜 Available Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start development server with HMR |
| `npm run build`   | Create production build           |
| `npm run preview` | Preview production build locally  |
| `npm run lint`    | Run ESLint checks                 |
| `npm run prepare` | Set up Husky git hooks            |

## 🔐 Authentication System

### JWT Implementation

- **Secure token storage** in memory during session
- **Automatic token inclusion** in API requests via Axios interceptors
- **Token expiration handling** with automatic logout
- **Role extraction** from JWT payload for authorization

### Protected Routes Example

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

<ProtectedRoute roles={['ADMIN', 'DOCTOR']}>
  <PatientManagementPage />
</ProtectedRoute>;
```

### Permission System

```tsx
// Role-based permission checking
const authService = useAuthService();

if (authService.hasPermission('patients:create')) {
  // Render create patient button
}
```

## 🎨 Design System

### Tailwind CSS Configuration

- **Custom color palette** optimized for medical applications
- **Consistent spacing scale** following design system principles
- **Responsive breakpoints** for all device sizes
- **Dark mode support** (configurable)

### Color Scheme

```css
Primary: Blue tones for primary actions and navigation
Secondary: Gray scales for secondary elements
Success: Green for positive states and confirmations
Warning: Amber for cautions and important notices
Error: Red for errors and dangerous actions
```

### Component Library

- **Accessible components** with ARIA labels and keyboard navigation
- **Consistent styling** across all interface elements
- **Loading states** and skeleton screens for better UX
- **Form validation** with real-time feedback

## 🔗 API Integration

### Backend Integration

- **Base URL**: `http://localhost:8080/g5/siscom/api`
- **Authentication**: Bearer token in Authorization header
- **Error handling**: Centralized error management with user notifications
- **Request/Response interceptors**: Automatic token management and logging

### Key Endpoints

```typescript
// Authentication endpoints
POST /auth/login              // User authentication
GET  /auth/me                 // Current user information

// Patient management
GET    /users/patients        // List all patients
POST   /users/patients        // Create new patient
PUT    /users/patients/:id    // Update patient
DELETE /users/patients/:id    // Delete patient

// Appointments
GET    /medical-appointments  // List appointments
POST   /medical-appointments  // Create appointment
PUT    /medical-appointments/:id // Update appointment

// Laboratory
GET    /medical-examinations  // List examinations
POST   /examination-results   // Submit test results
```

## 🧪 Testing & Quality Assurance

### Code Quality Tools

- **ESLint**: Configured with React, TypeScript, and accessibility rules
- **Prettier**: Consistent code formatting across the team
- **Husky**: Git hooks for pre-commit linting and pre-push building
- **TypeScript**: Strict mode enabled for maximum type safety

### Development Workflow

```bash
# Pre-commit: Runs ESLint and Prettier
# Pre-push: Runs TypeScript compilation and build
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Tomcat Deployment

The application is configured for deployment on Apache Tomcat:

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy to Tomcat**
   - Copy contents of `dist/` folder to Tomcat webapps directory
   - Configure reverse proxy for API calls to Spring Boot backend
   - Ensure proper MIME types are configured for SPA routing

### Environment Variables

```env
# Production environment
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=OncoLogic Clinic
VITE_NODE_ENV=production
```

## 📊 Performance Features

- **Code splitting** with React lazy loading
- **Bundle optimization** with Vite's tree shaking
- **Image optimization** and lazy loading
- **API response caching** with RTK Query
- **Memoized components** to prevent unnecessary re-renders

## 🔧 Development Guidelines

### Code Standards

- **Naming Conventions**:
  - camelCase for variables and functions
  - PascalCase for React components
  - kebab-case for file names
- **Import Organization**: Absolute imports using `@/` aliases
- **Component Structure**: Functional components with TypeScript
- **State Management**: Redux Toolkit for global state, React state for local

### Git Workflow

- Feature branches from `main`
- Pull request reviews required
- Automated testing on PR creation
- Squash and merge strategy

## 📈 Future Enhancements

- **Real-time notifications** with WebSocket integration
- **Advanced reporting** and analytics dashboard
- **Mobile application** development
- **Telemedicine features** for remote consultations
- **Integration with medical devices** and IoT sensors
- **Multi-language support** for international deployment

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

This is a private project developed by the specified team members. For internal development guidelines and contribution processes, please refer to the internal documentation.

---

**OncoLogic Clinic** - Empowering healthcare professionals with modern technology solutions.
