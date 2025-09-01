# Overview

BarberApp é uma aplicação web completa para agendamento online em barbearias, desenvolvida segundo o PRD fornecido. O MVP permite que clientes agendem serviços escolhendo serviço, profissional, data e horário, enquanto barbeiros gerenciam sua agenda através de um painel completo. A aplicação implementa todas as funcionalidades principais do PRD com autenticação, agendamento em 4 etapas, notificações e gestão de agenda.

## Status do Projeto
- ✅ Aplicação funcional com todas as telas implementadas  
- ✅ Banco de dados PostgreSQL configurado e populado com dados de teste
- ✅ Sistema de autenticação integrado com Replit Auth
- ✅ Fluxo de agendamento completo (4 etapas: Serviço → Profissional → Data → Horário)
- ✅ Dashboard do barbeiro com agenda semanal e gerenciamento de serviços
- ✅ Design responsivo com paleta premium (preto, cinza, dourado)

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: express-session with PostgreSQL session store
- **API Design**: RESTful API endpoints with proper error handling
- **Build Process**: ESBuild for production bundling

## Database Design
- **Primary Database**: PostgreSQL with Neon serverless connection
- **Schema Management**: Drizzle Kit for migrations and schema definitions
- **Key Tables**: users, services, professionals, appointments, professional_services, professional_schedules, professional_breaks, sessions
- **Relationships**: Complex many-to-many relationships between professionals and services, one-to-many for appointments

## Authentication & Authorization
- **Authentication Provider**: Replit OIDC integration with OpenID Connect
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **User Types**: Enum-based user roles (client, barber, admin)
- **Authorization**: Route-level middleware protection for authenticated endpoints

## External Dependencies

- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit OIDC provider for user authentication
- **UI Components**: Radix UI primitives for accessible component foundation
- **Development**: Replit-specific plugins for development environment integration
- **Fonts**: Google Fonts integration (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)
- **Date Handling**: date-fns for date manipulation and formatting with Portuguese locale support