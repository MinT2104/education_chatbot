# Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- MongoDB
- npm or yarn

## Installation Steps

### 1. Clone and Install Dependencies

```bash
cd education-chat-bot
npm install
```

### 2. Environment Variables

**Server:**
Copy `server/.env.example` to `server/.env` and fill in the values:

```bash
cd server
cp .env.example .env
```

**Client:**
Copy `client/.env.example` to `client/.env`:

```bash
cd client
cp .env.example .env
```

### 3. Generate Secrets

Generate strong random strings for JWT secrets (minimum 32 characters):

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. MongoDB Setup

Make sure MongoDB is running:

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local installation
mongod
```

### 5. Initialize Database

```bash
npm run init:db --workspace=server
```

### 6. Start Development Servers

```bash
npm run dev
```

This will start both client (http://localhost:5173) and server (http://localhost:3030)

## Project Structure

```
education-chat-bot/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Node.js backend (Express + TypeScript)
├── shared/          # Shared types and utilities
└── docs/            # Documentation
```

## Development

- **Client only**: `npm run dev:client`
- **Server only**: `npm run dev:server`
- **Both**: `npm run dev`

## Building for Production

```bash
npm run build
```

## Security Features

- JWT with refresh token rotation
- HTTP-only cookies
- Rate limiting
- Input validation
- CORS whitelist
- Helmet.js security headers
- Environment variable validation


