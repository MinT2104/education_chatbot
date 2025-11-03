import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { createServer } from 'http'
import { config } from './shared/config'
import { logger } from './core/logger'
import { errorHandler } from './shared/middleware/errorHandler'
import { requestLogger } from './shared/middleware/requestLogger'
import { rateLimiter } from './shared/middleware/rateLimiter'
import authRoutes from './features/auth/routes/authRoutes'
import chatRoutes from './features/chat/routes/chatRoutes'
import communityRoutes from './features/community/routes/communityRoutes'
import adminRoutes from './features/admin/routes/adminRoutes'
import publicRoutes from './features/public/routes/publicRoutes'

dotenv.config()

const app: Express = express()
const httpServer = createServer(app)
const PORT = config.port || 3030

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// CORS configuration - strict whitelist
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || config.allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Time-Zone'],
  exposedHeaders: ['X-Total-Count'],
}

app.use(cors(corsOptions))

// Body parsing middleware
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Request logging
app.use(requestLogger)

// Rate limiting
app.use(rateLimiter)

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', publicRoutes)

// Log routes for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('📋 Available API routes:')
  console.log('  - /api/auth/*')
  console.log('  - /api/chat/*')
  console.log('  - /api/community/*')
  console.log('  - /api/admin/*')
  console.log('  - /api/* (public)')
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler
app.use(errorHandler)

// Database connection
mongoose
  .connect(config.mongodbUrl, {
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    logger.info('✅ Connected to MongoDB')
    
    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📝 Environment: ${config.nodeEnv}`)
    })
  })
  .catch((error) => {
    logger.error('❌ MongoDB connection error:', error)
    process.exit(1)
  })

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    logger.info('HTTP server closed')
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed')
      process.exit(0)
    })
  })
})

export default app


