# Architecture Overview

## Project Structure

```
education-chat-bot/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── app/              # App configuration
│   │   ├── features/         # Feature modules
│   │   │   ├── auth/        # Authentication feature
│   │   │   ├── chat/        # Chat feature
│   │   │   ├── community/   # Community feature
│   │   │   ├── courses/     # Courses feature
│   │   │   ├── admin/       # Admin feature
│   │   │   ├── home/        # Home page
│   │   │   └── landing/     # Landing page
│   │   ├── shared/          # Shared code
│   │   │   ├── components/  # Reusable components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── utils/       # Utility functions
│   │   │   └── types/       # TypeScript types
│   │   ├── core/            # Core functionality
│   │   │   ├── api/         # API client setup
│   │   │   ├── store/       # Redux store
│   │   │   └── router/      # Routing configuration
│   │   └── assets/          # Static assets
│   └── ...
│
├── server/                    # Node.js Backend
│   ├── src/
│   │   ├── app.ts           # Express app setup
│   │   ├── features/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   │   ├── routes/
│   │   │   │   ├── controllers/
│   │   │   │   └── services/
│   │   │   ├── chat/       # Chat functionality
│   │   │   ├── community/  # Community features
│   │   │   ├── courses/    # Course management
│   │   │   ├── admin/      # Admin panel
│   │   │   └── public/     # Public endpoints
│   │   ├── shared/         # Shared code
│   │   │   ├── middleware/ # Express middleware
│   │   │   ├── utils/      # Utility functions
│   │   │   ├── types/      # TypeScript types
│   │   │   └── config/     # Configuration
│   │   ├── core/           # Core functionality
│   │   │   ├── database/   # DB connection
│   │   │   ├── logger/     # Logging setup
│   │   │   └── validation/ # Validation schemas
│   │   └── models/         # Database models
│   └── ...
│
├── shared/                   # Shared between client & server
│   └── types/               # Shared TypeScript types
│
└── docs/                     # Documentation
```

## Feature-Based Architecture

Each feature module is self-contained with:
- **Routes**: Express routes (server) / Route definitions (client)
- **Controllers**: Request handlers (server)
- **Services**: Business logic (server)
- **Components**: UI components (client)
- **Store**: Redux slices (client)
- **Types**: TypeScript interfaces
- **Utils**: Feature-specific utilities

## Data Flow

### Authentication Flow
1. User submits credentials
2. Client sends request to `/api/auth/login`
3. Server validates credentials
4. Server generates JWT tokens
5. Server sets HTTP-only cookies
6. Client receives user data
7. Client stores user in Redux state
8. Client redirects to protected route

### Chat Flow
1. User sends message
2. Client dispatches chat action
3. API client sends request with auth token
4. Server validates token via middleware
5. Server processes chat request
6. Server calls AI service (Gemini)
7. Server streams response back
8. Client updates chat state
9. UI renders new message

## Security Layers

1. **Transport Layer**: HTTPS (production)
2. **Authentication**: JWT with refresh tokens
3. **Authorization**: Role-based access control
4. **Rate Limiting**: Per-endpoint limits
5. **Input Validation**: Zod schemas
6. **Output Sanitization**: XSS prevention
7. **CORS**: Whitelist configuration
8. **Headers**: Helmet.js security headers
9. **Cookies**: HTTP-only, Secure, SameSite
10. **Error Handling**: No sensitive data leakage

## Technology Stack

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Redux Toolkit**: State management
- **React Router**: Routing
- **Tailwind CSS**: Styling
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **TypeScript**: Type safety
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Winston**: Logging

### Security
- **Helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **Zod**: Validation
- **JWT**: Token-based auth
- **CORS**: Cross-origin resource sharing

## Design Patterns

- **MVC**: Model-View-Controller (server)
- **Feature-based**: Domain-driven organization
- **Repository**: Data access abstraction
- **Service Layer**: Business logic separation
- **Middleware**: Cross-cutting concerns
- **Dependency Injection**: Loose coupling

## Best Practices

1. **Separation of Concerns**: Each layer has a single responsibility
2. **DRY**: Don't repeat yourself
3. **Type Safety**: Full TypeScript coverage
4. **Error Handling**: Consistent error responses
5. **Logging**: Comprehensive logging
6. **Testing**: Unit, integration, E2E tests
7. **Documentation**: Inline and external docs
8. **Code Style**: ESLint + Prettier
9. **Git Workflow**: Feature branches
10. **Security First**: Security by default


