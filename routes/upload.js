const express = require('express');
const upload = require('../middleware/upload'); // Import the upload middleware
const File = require('../models/File'); // Your file metadata model

const router = express.Router();

// Upload route
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // Create and save the file metadata to the database
    const file = new File({
      filename: req.file.filename,  // Save the unique filename
      originalName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      uploadTimestamp: new Date(),
    });

    const savedFile = await file.save();
    res.status(201).json({ message: 'File uploaded successfully', file: savedFile });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

module.exports = router;