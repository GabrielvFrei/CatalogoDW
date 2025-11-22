import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import autoresRoutes from './src/routes/autores.js';
import livrosRoutes from './src/routes/livros.js';
import dvdsRoutes from './src/routes/dvds.js';
import cdsRoutes from './src/routes/cds.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend static files (single server for API + frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// Conecta ao MongoDB e cria seed quando necessário
connectDB().catch(err => console.error(err));

// Rotas (modulares)
app.use('/api/auth', authRoutes);
app.use('/api/autores', autoresRoutes);
app.use('/api/livros', livrosRoutes);
app.use('/api/dvds', dvdsRoutes);
app.use('/api/cds', cdsRoutes);

// Serve frontend index at root
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API está funcionando!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎯 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
