export default function isAdmin(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Permissão negada: admin required' });
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
