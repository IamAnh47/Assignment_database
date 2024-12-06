
# Assignment Web

## Giới thiệu
Web sử dụng Node.js, sử dụng Express làm framework chính, Express-Handlebars để render giao diện và dùng DBMS là MySQL.

---

## Yêu cầu
- **Node.js**
- **npm** 
- **Cơ sở dữ liệu**: MySQL

---

## Cài đặt

### 1. Tải mã nguồn
Clone repository:
**git clone** *repository-url*


### 2. Di chuyển vào thư mục dự án
**cd assignment_web**

### 3. Cài đặt các thư viện
Sử dụng lệnh để cài đặt tất cả các thư viện cần thiết:
**npm install**

---

## Cấu hình môi trường
Tạo file **.env** trong thư mục gốc và thêm các thông tin cấu hình database:

# Cấu hình cơ sở dữ liệu
DB_HOST=localhost

DB_USER=root

DB_PASSWORD=your_password

DB_NAME=your_database_name

Thay thế **your_password** và **your_database_name** bằng thông tin phù hợp.

---

## Chạy ứng dụng

Khởi động web:

**npm start**

Lệnh trên sẽ khởi động server với **nodemon**, tự động tải lại khi có thay đổi trong mã nguồn.

---

## Cấu trúc

assignment_web/

│

├── app.js                  # File chính khởi động ứng dụng

├── views/                  # File giao diện

    ├── layouts/
        ├── main.hbs
    ├── login.hbs
    ├── home.hbs
    ├── hash_tools.hbs

├── server/                 # Server

    ├── controllers/
        ├── userController.js
        ├── hashController.js
    ├── models/ 
        ├── db.js
    ├── routes/
        ├── user.js
    ├── middlewares/
        ├── authMiddleware.js
    
├── public/                 # Tệp tĩnh (CSS, JS)

├── .env                    # File cấu hình biến môi trường

├── package-lock.json

├── package.json            # Danh sách thư viện và script

└── README.md               # Hướng dẫn

\`\`\`

---
    ├── employee.hbs
    ├── branch.hbs
    ├── store.hbs
    ├── warehouse.hbs
    ├── product.hbs
    ├── infoAdmin.hbs
## Hỗ trợ
Nếu gặp vấn đề, vui lòng liên hệ tui

**Người thực hiện**: [Tuấn Anh]  
**Email**: [anh.phanitskyye@hcmut.edu.vn]
