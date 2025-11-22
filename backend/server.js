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

// 🔥 CONEXÃO MONGODB MELHORADA PARA RENDER
connectDB().then(() => {
  console.log('✅ MongoDB inicializado no Render');
}).catch(err => {
  console.error('❌ MongoDB não conectado:', err.message);
});

// 🔥 MIDDLEWARE INTELIGENTE - Só verifica DB para rotas que precisam
const checkDB = (req, res, next) => {
  // Rotas que NÃO precisam de DB
  const publicRoutes = ['/api/health', '/api/test-db'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }
  
  // Rotas que precisam de DB
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database conectando... tente novamente em alguns segundos',
      readyState: mongoose.connection.readyState
    });
  }
  next();
};

// Aplicar middleware apenas nas rotas que precisam de DB
app.use('/api/auth', checkDB, authRoutes);
app.use('/api/autores', checkDB, autoresRoutes);
app.use('/api/livros', checkDB, livrosRoutes);
app.use('/api/dvds', checkDB, dvdsRoutes);
app.use('/api/cds', checkDB, cdsRoutes);

// Serve frontend index at root
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Serve outras páginas do frontend
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(frontendDir, 'login.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(frontendDir, 'admin.html'));
});

// 🔥 HEALTH CHECK MELHORADO - SEMPRE FUNCIONA
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado';
  
  res.json({
    success: true, // ⬅️ SEMPRE true, pois a API está online
    message: dbStatus === 'Conectado' ? 'API está funcionando perfeitamente!' : 'API online - Database conectando...',
    database: dbStatus,
    readyState: mongoose.connection.readyState,
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// 🔥 ROTA DE TESTE DE DB - Só funciona se DB estiver conectado
app.get('/api/test-db', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database ainda não conectado'
      });
    }
    
    const autoresCount = await mongoose.connection.db.collection('autores').countDocuments();
    res.json({
      success: true,
      message: 'Database funcionando!',
      autoresCount: autoresCount,
      collections: await mongoose.connection.db.listCollections().toArray()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database error: ' + error.message
    });
  }
});

// 🔥 PORTA PARA RENDER
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🎯 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Conectando...'}`);
  console.log(`🚀 Render URL: https://catalogodw.onrender.com`);
});

export default app;