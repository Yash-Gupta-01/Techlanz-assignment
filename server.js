const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uploadRoutes = require('./routes/upload');
const downloadRoutes = require('./routes/download');
const deleteRoutes = require('./routes/delete');

app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);
app.use('/delete', deleteRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the File Upload Service API');
});



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    console.log('MongoDB Connected');
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));



