import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

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

// Conecta ao MongoDB
connectDB().then(() => {
  console.log('✅ MongoDB inicializado');
}).catch(err => {
  console.error('❌ MongoDB não conectado:', err.message);
});

// Middleware para verificar conexão com DB
const checkDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database não conectado. Aguarde alguns segundos.',
      readyState: mongoose.connection.readyState
    });
  }
  next();
};

// Rotas (modulares) - todas exigem DB conectado
app.use('/api/auth', checkDB, authRoutes);
app.use('/api/autores', checkDB, autoresRoutes);
app.use('/api/livros', checkDB, livrosRoutes);
app.use('/api/dvds', checkDB, dvdsRoutes);
app.use('/api/cds', checkDB, cdsRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(frontendDir, 'login.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(frontendDir, 'admin.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado';
  
  res.json({
    success: dbStatus === 'Conectado',
    message: dbStatus === 'Conectado' ? 'API está funcionando perfeitamente!' : 'API online - Database conectando...',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Porta universal (Local + Render)
const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando: http://${HOST}:${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Conectando...'}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`✅ Deploy: https://catalogodw.onrender.com`);
  }
});

export default app;