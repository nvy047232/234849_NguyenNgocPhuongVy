const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookRoutes = require('./src/routes/bookRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint GET /health kiểm tra trạng thái hoạt động backend (Mục 8)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend API đang hoạt động bình thường',
    timestamp: new Date()
  });
});

// Routes API quản lý sách
app.use('/api/books', bookRoutes);

// Kết nối MongoDB Atlas và khởi chạy Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Đã kết nối thành công tới MongoDB Atlas!');
    app.listen(PORT, () => {
      console.log(`Server Backend đang chạy tại port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB Atlas:', err.message);
  });