import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export const register = async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ success: false, message: 'Dados incompletos' });
    }

    const exists = await Usuario.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Usuário já existe' });

  const hashed = await bcrypt.hash(password, 12);
  // Garantir que novos usuários recebam o papel 'user' — evita que clientes
  // maliciosos consigam se registrar como administradores.
  const usuario = await Usuario.create({ nome, email, password: hashed, role: 'user' });

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({ success: true, token, user: { id: usuario._id, nome: usuario.nome, email: usuario.email, role: usuario.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Dados incompletos' });

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ success: true, token, user: { id: usuario._id, nome: usuario.nome, email: usuario.email, role: usuario.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
