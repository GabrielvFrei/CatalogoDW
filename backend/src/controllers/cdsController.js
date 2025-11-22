import CD from '../models/CD.js';

export const listCDs = async (req, res) => {
  try {
    const cds = await CD.find().populate('autor').sort({ createdAt: -1 });
    res.json({ success: true, count: cds.length, data: cds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCD = async (req, res) => {
  try {
    const cd = await CD.create(req.body);
    await cd.populate('autor');
    res.status(201).json({ success: true, data: cd });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCD = async (req, res) => {
  try {
    const cd = await CD.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('autor');
    if (!cd) return res.status(404).json({ success: false, message: 'CD não encontrado' });
    res.json({ success: true, data: cd });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCD = async (req, res) => {
  try {
    const cd = await CD.findByIdAndDelete(req.params.id);
    if (!cd) return res.status(404).json({ success: false, message: 'CD não encontrado' });
    res.json({ success: true, message: 'CD deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
