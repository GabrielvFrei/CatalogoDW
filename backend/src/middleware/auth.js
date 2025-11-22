import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export default async function auth(req, res, next) {
  try {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ success: false, message: 'Token não fornecido' });

    const token = header.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.id) return res.status(401).json({ success: false, message: 'Token inválido' });

    const user = await Usuario.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'Usuário não encontrado' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
}
