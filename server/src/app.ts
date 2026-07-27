import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes.js';

dotenv.config();

const app = express();

const ALLOWED_ORIGINS = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin (no origin header) and explicit allowlist
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
