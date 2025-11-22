import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'; // ⬅️ IMPORTANTE: importar mongoose

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import autoresRoutes from './src/routes/autores.js';
import livrosRoutes from './src/routes/livros.js';
import dvdsRoutes from './src/routes/dvds.js';
import cdsRoutes from './src/routes/cds.js';

// Determine __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend static files (single server for API + frontend)
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// 🔥 CONEXÃO MONGODB MELHORADA
connectDB().then(() => {
  console.log('✅ MongoDB inicializado');
}).catch(err => {
  console.error('❌ MongoDB não conectado, mas servidor continua:', err.message);
});

// 🔥 MIDDLEWARE PARA VERIFICAR CONEXÃO COM DB
app.use('/api/*', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database temporariamente indisponível. Tente novamente em alguns segundos.'
    });
  }
  next();
});

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

// 🔥 HEALTH CHECK MELHORADO
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado';
  
  res.json({
    success: dbStatus === 'Conectado',
    message: dbStatus === 'Conectado' ? 'API está funcionando perfeitamente!' : 'API online mas sem database',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 🔥 ROTA DE FALLBACK PARA DB OFFLINE
app.get('/api/test-db', async (req, res) => {
  try {
    const autoresCount = await mongoose.connection.db.collection('autores').countDocuments();
    res.json({
      success: true,
      message: 'Database funcionando!',
      autoresCount: autoresCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database error: ' + error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎯 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
});

export default app;