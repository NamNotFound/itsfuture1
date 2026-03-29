require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const scoreRoutes = require('./routes/scores');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML pages FIRST (before API routes to avoid conflicts)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/quiz', (req, res) => res.sendFile(path.join(__dirname, 'public', 'quiz.html')));
app.get('/result', (req, res) => res.sendFile(path.join(__dirname, 'public', 'result.html')));
app.get('/leaderboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'leaderboard.html')));
app.get('/admin/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html')));
app.get('/admin/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html')));

// API Routes AFTER HTML pages
app.use('/admin', authRoutes);
app.use('/', questionRoutes);
app.use('/', scoreRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedAdmin();
    await seedQuestions();
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Seed admin account
async function seedAdmin() {
  const Admin = require('./models/Admin');
  const bcrypt = require('bcryptjs');
  const count = await Admin.countDocuments();
  if (count === 0) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await Admin.create({ username: process.env.ADMIN_USERNAME || 'admin', password: hashed });
    console.log('✅ Admin account created: admin / admin123');
  }
}

// Seed sample questions
async function seedQuestions() {
  const Question = require('./models/Question');
  const count = await Question.countDocuments();
  if (count === 0) {
    const questions = [
      // HTML
      { question: 'Thẻ HTML nào dùng để tạo liên kết?', options: ['<link>', '<a>', '<href>', '<url>'], correct: 1 },
      { question: 'Thẻ nào dùng để hiển thị tiêu đề lớn nhất trong HTML?', options: ['<h6>', '<heading>', '<h1>', '<title>'], correct: 2 },
      { question: 'Thuộc tính nào dùng để chỉ định URL đích của thẻ <a>?', options: ['src', 'link', 'href', 'url'], correct: 2 },
      { question: 'Thẻ HTML nào dùng để tạo danh sách có thứ tự?', options: ['<ul>', '<list>', '<ol>', '<li>'], correct: 2 },
      { question: 'DOCTYPE trong HTML dùng để làm gì?', options: ['Định nghĩa kiểu tài liệu', 'Tạo tiêu đề trang', 'Kết nối CSS', 'Tạo form'], correct: 0 },
      { question: 'Thẻ nào dùng để chèn ảnh trong HTML?', options: ['<picture>', '<photo>', '<image>', '<img>'], correct: 3 },
      // CSS
      { question: 'Thuộc tính CSS nào dùng để thay đổi màu chữ?', options: ['font-color', 'text-color', 'color', 'foreground'], correct: 2 },
      { question: 'Giá trị nào của "display" ẩn phần tử và không chiếm không gian?', options: ['hidden', 'none', 'invisible', 'collapse'], correct: 1 },
      { question: 'CSS Flexbox dùng thuộc tính nào để căn giữa theo trục ngang?', options: ['align-items', 'justify-items', 'justify-content', 'align-content'], correct: 2 },
      { question: 'Selector CSS nào chọn tất cả thẻ <p> trong thẻ <div>?', options: ['div + p', 'div > p', 'div p', 'div.p'], correct: 2 },
      { question: 'Thuộc tính nào tạo khoảng cách bên trong phần tử?', options: ['margin', 'border', 'padding', 'spacing'], correct: 2 },
      { question: 'Media query nào áp dụng style khi màn hình nhỏ hơn 768px?', options: ['@media (max-width: 768px)', '@media (min-width: 768px)', '@media screen 768px', '@media width: 768px'], correct: 0 },
      // JavaScript
      { question: 'Từ khóa nào khai báo biến không thể gán lại trong JavaScript?', options: ['var', 'let', 'const', 'fixed'], correct: 2 },
      { question: 'Phương thức nào dùng để thêm phần tử vào cuối mảng?', options: ['append()', 'add()', 'push()', 'insert()'], correct: 2 },
      { question: 'Kết quả của "typeof null" trong JavaScript là gì?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correct: 2 },
      { question: 'Hàm nào dùng để chuyển chuỗi thành số nguyên?', options: ['toInt()', 'parseInt()', 'Number()', 'integer()'], correct: 1 },
      { question: 'Arrow function nào sau đây đúng cú pháp?', options: ['function => (x) x*2', 'x => x * 2', '(x) -> x * 2', 'x -> return x*2'], correct: 1 },
      { question: 'Phương thức nào dùng để tìm phần tử HTML theo ID?', options: ['querySelector()', 'getElement()', 'getElementById()', 'findById()'], correct: 2 },
      { question: 'Toán tử nào kiểm tra bằng nhau cả giá trị và kiểu dữ liệu?', options: ['==', '=', '===', '!=='], correct: 2 },
      { question: 'Promise.all() làm gì?', options: ['Chạy tuần tự từng promise', 'Chạy tất cả promise song song và chờ tất cả hoàn thành', 'Lấy promise đầu tiên hoàn thành', 'Bỏ qua lỗi của promise'], correct: 1 },
    ];
    await Question.insertMany(questions);
    console.log(`✅ Seeded ${questions.length} questions`);
  }
}
