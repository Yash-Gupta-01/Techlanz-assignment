const express = require('express');
const multer = require('multer');
const File = require('../models/File'); // Your file metadata model
const path = require('path');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Your upload directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`; // Generating a unique name
    cb(null, uniqueName); // Saving the unique name
  },
});

// Multer setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and PDFs are allowed.'));
    }
    cb(null, true);
  },
});

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
