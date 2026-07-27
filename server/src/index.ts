import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const ALLOWED_ORIGINS = [
  process.env.CLIENT_ORIGIN,        // Vercel production URL
  'http://localhost:5173',           // Vite dev server
  'http://localhost:4173',           // Vite preview
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/v1', apiRouter);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

