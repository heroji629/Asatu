require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();
// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Asatu Backend Running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: ${process.env.MONGODB_URI.split('@')[1]}`); // Shows cluster info
});
