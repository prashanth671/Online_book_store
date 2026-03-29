const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// CORS — allow frontend origin
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/books',  require('./routes/books'));
app.use('/api/cart',   require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/', (_req, res) => res.json({ message: 'BookStore API is running ✅' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
