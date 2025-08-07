import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import secretRoutes from './routes/secretRoutes.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

//  Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),                 // limit each IP to 100 requests per windowMs
  standardHeaders: true,    
  legacyHeaders: false,    
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter); // Apply to all requests

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.status(200).send("OK"));
app.use('/api/secrets', secretRoutes);

export default app;
