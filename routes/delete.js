const express = require('express');
const File = require('../models/File'); // Your file metadata model
const fs = require('fs'); // To delete the file from the filesystem
const path = require('path');

const router = express.Router();

// Delete route
router.delete('/:id', async (req, res) => {
  try {
    // Find the file metadata in the database using the provided _id
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, '../uploads', file.filename);
    fs.unlinkSync(filePath); // Delete the file from the uploads folder

    // Delete the file metadata from the database using findByIdAndDelete
    await File.findByIdAndDelete(req.params.id); // This removes the document from MongoDB

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error.message);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});

module.exports = router;
