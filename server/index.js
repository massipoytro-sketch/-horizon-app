import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const app = express();
const portSchema = z.coerce.number().int().min(1).max(65535).default(3000);
const portResult = portSchema.safeParse(process.env.PORT ?? 3000);
const PORT = portResult.success ? portResult.data : 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || false,
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '32kb' }));
app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}));

const providers = [
  { id: 'cpalead', name: 'CPAlead', integration: 'pending', mode: 'api' },
  { id: 'cpagrip', name: 'CPAGrip', integration: 'pending', mode: 'offerwall' },
  { id: 'timewall', name: 'TimeWall', integration: 'pending', mode: 'offerwall' },
  { id: 'cpx', name: 'CPX Research', integration: 'pending', mode: 'survey' },
];

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'horizon-provider-lab' });
});

app.get('/api/providers', (_req, res) => {
  res.json({ providers });
});

app.get('/api/config-status', (_req, res) => {
  res.json({
    cpalead: Boolean(process.env.CPALEAD_PUBLISHER_ID),
    cpagrip: Boolean(process.env.CPAGRIP_WALL_URL),
    timewall: Boolean(process.env.TIMEWALL_WALL_URL),
    cpx: Boolean(process.env.CPX_WALL_URL),
  });
});

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { index: false, maxAge: '1h' }));
  app.get('*splat', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path === '/health') return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error('Unhandled request error:', err?.message || 'unknown error');
  res.status(500).json({ error: 'internal_server_error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Horizon server listening on port ${PORT}`);
});
