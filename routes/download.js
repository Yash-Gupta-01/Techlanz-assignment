const express = require('express');
const path = require('path');
const File = require('../models/File');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(path.join(__dirname, '../uploads', file.filename), file.filename);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
});

module.exports = router;
