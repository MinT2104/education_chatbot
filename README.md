# Education Chat Bot v2.0

Improved version of Education Chat Bot with enhanced security, better architecture, and organized codebase.

## 🚀 Features

- 🤖 AI Chat Interface (Gemini AI)
- 🔐 Secure Authentication (Google OAuth, Email/Password with JWT refresh tokens)
- 👥 User Management
- 🛡️ Admin Panel
- 👨‍👩‍👧‍👦 Community Features (Prayers, Praise)
- 📚 Course Management
- 💳 Subscription & Plans
- 🎥 Video Slides
- 🔊 Text-to-Speech
- 📝 Chat History & Favorites
- 🎵 Song to Sermon Conversion
- 🌐 Multi-language Support

## 🏗️ Architecture Improvements

### Frontend (Client)
- ⚡ Vite for fast development and building
- 📘 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🔄 Redux Toolkit for state management
- 📁 Feature-based folder structure

### Backend (Server)
- 📘 TypeScript for type safety
- 🏛️ MVC architecture with clear separation
- 🔒 Enhanced security middleware
- ✅ Input validation with Joi/Zod
- 🚦 Rate limiting
- 📝 Comprehensive logging
- 🔐 JWT with refresh token rotation

### Security Enhancements
- ✅ Refresh token rotation
- ✅ Secure HTTP-only cookies
- ✅ CORS whitelist configuration
- ✅ Input sanitization
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Rate limiting per endpoint
- ✅ Helmet.js security headers
- ✅ Environment variable validation

## 📁 Project Structure

```
education-chat-bot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── app/           # App configuration
│   │   ├── features/      # Feature-based modules
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── community/
│   │   │   ├── courses/
│   │   │   └── admin/
│   │   ├── shared/        # Shared components, hooks, utils
│   │   ├── core/          # Core configuration
│   │   └── assets/        # Static assets
│   └── ...
├── server/                # Node.js backend
│   ├── src/
│   │   ├── app/           # Express app setup
│   │   ├── features/      # Feature modules
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── community/
│   │   │   └── ...
│   │   ├── shared/        # Shared utilities
│   │   ├── core/          # Core configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Database models
│   │   └── types/         # TypeScript types
│   └── ...
├── shared/                # Shared code between client & server
│   └── types/             # Shared TypeScript types
└── docs/                  # Documentation
```

## 🛠️ Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB
- Redis (optional, for caching/rate limiting)

### Setup

1. Clone and navigate to the project:
```bash
cd education-chat-bot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Client (.env):**
```env
VITE_API_URL=http://localhost:3030
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Server (.env):**
```env
NODE_ENV=development
PORT=3030
MONGODB_URL=mongodb://localhost:27017/education-chat-bot
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_session_secret
```

4. Initialize database:
```bash
npm run init:db --workspace=server
```

5. Start development servers:
```bash
npm run dev
```

## 📝 Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run start` - Start production server
- `npm run lint` - Run linter on all workspaces

## 🔒 Security Features

- JWT tokens with refresh token rotation
- HTTP-only cookies for token storage
- Rate limiting on all API endpoints
- Input validation and sanitization
- CORS whitelist configuration
- Security headers (Helmet.js)
- Environment variable validation
- SQL injection prevention
- XSS protection

## 📚 Documentation

See `/docs` folder for detailed documentation on:
- API endpoints
- Authentication flow
- Database schema
- Deployment guide

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

Private - All rights reserved


