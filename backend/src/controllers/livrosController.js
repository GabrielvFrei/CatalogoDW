import Livro from '../models/Livro.js';

export const listLivros = async (req, res) => {
  try {
    const livros = await Livro.find().populate('autor').sort({ createdAt: -1 });
    res.json({ success: true, count: livros.length, data: livros });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLivro = async (req, res) => {
  try {
    const livro = await Livro.create(req.body);
    await livro.populate('autor');
    res.status(201).json({ success: true, data: livro });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLivro = async (req, res) => {
  try {
    const livro = await Livro.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('autor');
    if (!livro) return res.status(404).json({ success: false, message: 'Livro não encontrado' });
    res.json({ success: true, data: livro });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLivro = async (req, res) => {
  try {
    const livro = await Livro.findByIdAndDelete(req.params.id);
    if (!livro) return res.status(404).json({ success: false, message: 'Livro não encontrado' });
    res.json({ success: true, message: 'Livro deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
