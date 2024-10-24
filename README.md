# Quản lý Đặt Tour Du Lịch

## Giới thiệu
Dự án "Quản lý đặt tour du lịch" cung cấp hệ thống quản lý và đặt tour bao gồm giao diện dành cho người dùng, quản trị viên và hệ thống backend.

## Cấu trúc dự án
Website-dat-tour/
├── admin/          # Trang quản trị
├── server/         # Backend API
├── user/           # Trang người dùng
└── database/       # Cấu trúc và dữ liệu mẫu

## Công nghệ sử dụng
- **Frontend (admin, user)**: React.js, Vite, Bun
- **Backend**: Node.js, Express
- **Database**: MySQL

## Yêu cầu hệ thống

- Node.js (v20.0 trở lên)
- Bun Runtime
- MySQL 
- ReactJS
- Vite

## Cài đặt

1/ Cài đặt và chạy Server:
- cd server
- bun install
- bun server.js

2/ Cài đặt và chạy Admin Portal:
- cd admin
- bun install
- bun run dev

3/ Cài đặt và chạy User Portal:
- cd user
- bun install
- bun run dev

4/ Liên kết thanh toán với momo
1/ Vào config.js bên trong folder server
2/ Tải ngrok ( nếu chưa có hosting, nếu có rồi thì skip đến bước 4)
3/ Mở ngrok.exe và nhập lệnh *ngrok http 5000*
4/ Copy ip vào ipnRL 
