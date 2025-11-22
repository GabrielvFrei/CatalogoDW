import Autor from '../models/Autor.js';

export const listAutores = async (req, res) => {
  try {
    const autores = await Autor.find().sort({ createdAt: -1 });
    res.json({ success: true, count: autores.length, data: autores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAutor = async (req, res) => {
  try {
    const autor = await Autor.create(req.body);
    res.status(201).json({ success: true, data: autor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAutor = async (req, res) => {
  try {
    const autor = await Autor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!autor) return res.status(404).json({ success: false, message: 'Autor não encontrado' });
    res.json({ success: true, data: autor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAutor = async (req, res) => {
  try {
    const autor = await Autor.findByIdAndDelete(req.params.id);
    if (!autor) return res.status(404).json({ success: false, message: 'Autor não encontrado' });
    res.json({ success: true, message: 'Autor deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
