# Hệ Thống Quản Lý Sách Trên Nền Tảng Đám Mây

**Môn học:** Điện toán đám mây  
**Sinh viên thực hiện:** Nguyễn Ngọc Phương Vy - MSSV: 234849  
**Repository:** 234849_NguyenNgocPhuongVy  

---

## 1. Mô tả đề tài
Ứng dụng web quản lý sách cho phép thực hiện các thao tác thêm, xem, sửa, xóa sách. Hệ thống được đóng gói bằng Docker và triển khai trên nền tảng đám mây Render kết hợp MongoDB Atlas.

## 2. Công nghệ sử dụng
- **Frontend:** React, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (database name: `234849_NguyenNgocPhuongVy`, collection: `books`)
- **DevOps & Cloud:** Docker, Docker Hub, Git/GitHub, Render

## 3. Cấu trúc dự án
```text
234849_NguyenNgocPhuongVy/
├── backend/            # Mã nguồn phía Server (Node.js/Express)
├── frontend/           # Mã nguồn phía Client (React)
├── .gitignore          # Cấu hình bỏ qua tệp/thư mục không cần quản lý mã nguồn
└── README.md           # Hướng dẫn dự án