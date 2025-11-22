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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Servir os arquivos estáticos do frontend a partir deste servidor (API + frontend juntos)
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// Conectar ao MongoDB e inicializar dados quando necessário
connectDB().then(() => {
  
}).catch(err => {
  console.error('❌ MongoDB não conectado:', err.message);
});

// Middleware que verifica se a conexão com o banco está pronta antes de processar a rota
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

// Registro das rotas da API (mapeamento para os módulos em src/routes)
app.use('/api/auth', checkDB, authRoutes);
app.use('/api/autores', checkDB, autoresRoutes);
app.use('/api/livros', checkDB, livrosRoutes);
app.use('/api/dvds', checkDB, dvdsRoutes);
app.use('/api/cds', checkDB, cdsRoutes);

// Entregar páginas estáticas do frontend (rotas principais)
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(frontendDir, 'login.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(frontendDir, 'admin.html'));
});

// Rota de verificação rápida (health check) — informa estado do servidor e do banco
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

const PORT = process.env.PORT || 10000;

// ESCUTAR EM 0.0.0.0 (IMPORTANTE PARA RENDER)
const server = app.listen(PORT, '0.0.0.0', () => {
  
});

// CONFIRMAÇÃO DE QUE A PORTA ESTÁ ABERTA
server.on('listening', () => {
  
});

export default app;