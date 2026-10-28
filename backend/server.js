const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookRoutes = require('./src/routes/bookRoutes');

const app = express();
app.use(cors()); 
app.use(express.json());

// Cấu hình CORS thủ công cho phép mọi tên miền và mọi phương thức HTTP
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Xử lý riêng cho yêu cầu kiểm tra Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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