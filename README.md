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

## 🏗️ Architecture

### Tech Stack

- ⚡ Vite for fast development and building
- 📘 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🔄 Redux Toolkit for state management
- 📁 Feature-based folder structure
- 🔄 React Router for navigation

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
├── src/                   # Source code
│   ├── features/          # Feature-based modules
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── community/
│   │   ├── courses/
│   │   ├── admin/
│   │   ├── home/
│   │   └── landing/
│   ├── core/              # Core configuration (API, routing, store)
│   │   ├── api/
│   │   ├── router/
│   │   └── store/
│   └── index.css          # Global styles
├── docs/                  # Documentation
├── dist/                  # Build output
└── ...
```

## 🛠️ Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

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

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:3030/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

4. Start development server:

```bash
npm run dev
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run type-check` - TypeScript type checking

## 🔒 Security Features

- Environment-based API configuration
- Input validation
- XSS protection
- Secure storage for tokens

## 📚 Documentation

See `/docs` folder for detailed documentation on:

- Features overview
- Implementation status
- Security guidelines
- Setup instructions

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

Private - All rights reserved
