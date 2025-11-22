import DVD from '../models/DVD.js';

export const listDVDs = async (req, res) => {
  try {
    const dvds = await DVD.find().populate('autor').sort({ createdAt: -1 });
    res.json({ success: true, count: dvds.length, data: dvds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDVD = async (req, res) => {
  try {
    const dvd = await DVD.create(req.body);
    await dvd.populate('autor');
    res.status(201).json({ success: true, data: dvd });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDVD = async (req, res) => {
  try {
    const dvd = await DVD.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('autor');
    if (!dvd) return res.status(404).json({ success: false, message: 'DVD não encontrado' });
    res.json({ success: true, data: dvd });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDVD = async (req, res) => {
  try {
    const dvd = await DVD.findByIdAndDelete(req.params.id);
    if (!dvd) return res.status(404).json({ success: false, message: 'DVD não encontrado' });
    res.json({ success: true, message: 'DVD deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
