# 🎯 Quiz App — HTML CSS JavaScript

Website trắc nghiệm kiến thức lập trình web cơ bản với backend Node.js + MongoDB.

---

## 📁 Cấu trúc thư mục

```
quiz-app/
├── server.js                 # Entry point
├── package.json
├── .env.example              # Mẫu cấu hình môi trường
├── models/
│   ├── Question.js
│   ├── Score.js
│   └── Admin.js
├── routes/
│   ├── auth.js               # POST /admin/login
│   ├── questions.js          # CRUD questions
│   └── scores.js             # Submit + leaderboard
├── middleware/
│   └── auth.js               # JWT middleware
└── public/                   # Frontend tĩnh
    ├── style.css             # Shared CSS
    ├── utils.js              # Shared JS (toast, api helper)
    ├── index.html            # Nhập tên
    ├── quiz.html             # Làm bài
    ├── result.html           # Kết quả
    ├── leaderboard.html      # Bảng xếp hạng
    └── admin/
        ├── login.html        # Admin login
        └── dashboard.html    # Admin dashboard
```

---

## 🚀 Hướng dẫn cài đặt

### 1. Clone và cài dependencies

```bash
git clone <repo-url>
cd quiz-app
npm install
```

### 2. Cấu hình MongoDB Atlas

1. Vào [mongodb.com/atlas](https://www.mongodb.com/atlas) → Tạo cluster miễn phí
2. Tạo Database User (username + password)
3. Whitelist IP: `0.0.0.0/0` (cho phép mọi IP)
4. Lấy connection string: **Connect → Drivers → Node.js**

### 3. Tạo file `.env`

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/quizapp?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_string_here
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Chạy server

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

Mở trình duyệt: **http://localhost:3000**

---

## 🌐 Các trang

| URL | Mô tả |
|-----|-------|
| `/` | Trang nhập tên |
| `/quiz` | Làm bài trắc nghiệm |
| `/result` | Xem kết quả |
| `/leaderboard` | Bảng xếp hạng top 10 |
| `/admin/login` | Admin đăng nhập |
| `/admin/dashboard` | Admin quản lý |

---

## 🔌 API Endpoints

### Public
| Method | URL | Mô tả |
|--------|-----|-------|
| `GET` | `/questions` | Lấy tất cả câu hỏi (không có đáp án đúng) |
| `POST` | `/check-answers` | Kiểm tra đáp án |
| `POST` | `/submit-score` | Nộp điểm |
| `GET` | `/leaderboard` | Top 10 điểm cao nhất |

### Admin (cần JWT token)
| Method | URL | Mô tả |
|--------|-----|-------|
| `POST` | `/admin/login` | Đăng nhập, nhận JWT |
| `GET` | `/admin/questions` | Danh sách câu hỏi (có đáp án đúng) |
| `POST` | `/admin/questions` | Thêm câu hỏi mới |
| `DELETE` | `/admin/questions/:id` | Xóa câu hỏi |
| `GET` | `/admin/stats` | Thống kê hệ thống |

---

## 👤 Tài khoản Admin mặc định

```
Username: admin
Password: admin123
```

> ⚠️ Đổi mật khẩu trong `.env` trước khi deploy production!

---

## ✨ Tính năng

**User:**
- ✅ Nhập tên, lưu localStorage
- ✅ 10 câu hỏi ngẫu nhiên từ MongoDB
- ✅ Timer đếm ngược (user tự chọn, mặc định 5 phút)
- ✅ Highlight đúng/sai sau mỗi câu
- ✅ Tính điểm server-side (không gian lận)
- ✅ Bảng xếp hạng top 10
- ✅ Toast thông báo
- ✅ Loading animation
- ✅ Responsive mobile/PC

**Admin:**
- ✅ Đăng nhập JWT (8 giờ)
- ✅ Thêm/xóa câu hỏi
- ✅ Thống kê: lượt chơi, người chơi, điểm TB
- ✅ Xem top 5 leaderboard

---

## 🛠 Deploy lên Render.com (miễn phí)

1. Push code lên GitHub
2. Vào [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Build command: `npm install`
5. Start command: `npm start`
6. Thêm Environment Variables (từ `.env`)
7. Deploy!
