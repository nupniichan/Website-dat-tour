# Quản lý Đặt Tour Du Lịch

## Giới thiệu

Dự án "Quản lý đặt tour du lịch" là một hệ thống toàn diện cho phép quản lý và đặt tour du lịch trực tuyến. Hệ thống bao gồm giao diện người dùng (user), giao diện quản trị viên (admin) và một hệ thống backend mạnh mẽ.

## Tính năng chính

* **Quản lý tour:** Thêm, sửa, xóa thông tin tour du lịch (hình ảnh, mô tả, giá cả, lịch trình,...)
* **Đặt tour:** Người dùng có thể dễ dàng tìm kiếm và đặt tour.
* **Quản lý người dùng:** Quản lý thông tin người dùng, lịch sử đặt tour.
* **Quản lý thanh toán:**  Hỗ trợ thanh toán qua Momo (hoặc các cổng thanh toán khác).
* **Báo cáo thống kê:**  Cung cấp báo cáo về doanh thu, số lượng đặt tour,...
* **Quản lý phản hồi:** Quản lý các phản hồi và đánh giá từ khách hàng.
Và nhiều tính năng khác...

## Cấu trúc dự án

```
website-dat-tour/
├── admin/          # Giao diện quản trị viên (Admin Portal)
│   └── ...
├── server/         # Backend API (RESTful API)
│   └── ...
├── user/           # Giao diện người dùng (User Portal)
│   └── ...
└── database/       # Sơ đồ cơ sở dữ liệu và dữ liệu mẫu
    └── ...
```

## Công nghệ

* **Frontend (admin, user):** React.js, Vite, Bun
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Thanh toán:** Momo 

## Yêu cầu hệ thống

* **Node.js:** v20.0 trở lên
* **Bun runtime** 
* **MySQL** 
* **Git**


## Cài đặt và chạy

**1. Cài đặt và chạy Backend:**

```bash
cd server
bun install
bun server.js
```

**2. Cài đặt và chạy Admin Portal:**

```bash
cd admin
bun install  
bun run dev  
```

**3. Cài đặt và chạy User Portal:**

```bash
cd user
bun install 
bun run dev  
```

**4. Cấu hình thanh toán Momo:**

1. Truy cập file `config.js` trong thư mục `server`.
2. **Nếu chưa có hosting:**  Cài đặt và chạy ngrok: `ngrok http 5000`.  Sao chép địa chỉ IP được cung cấp bởi ngrok và dán vào trường `ipnRL` trong `config.js`.
3. **Nếu đã có hosting:** Sử dụng địa chỉ IP/URL của hosting thay cho địa chỉ ngrok.

## Đóng góp
Cảm ơn các bạn đã hợp tác để hoàn thiện được website
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ThePinkKitten">
        <img src="https://avatars.githubusercontent.com/u/61980152?v=4" width="100px;" alt="ThePinkKitten"/><br />
        <sub><b>ThePinkKitten</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Tequinzyy">
        <img src="https://avatars.githubusercontent.com/u/116754124?v=4" width="100px;" alt="Tequinzyy"/><br />
        <sub><b>Tequinzyy</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/KevzCz">
        <img src="https://avatars.githubusercontent.com/u/130611225?v=4" width="100px;" alt="KevzCz"/><br />
        <sub><b>KevzCz</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Phatds357">
        <img src="https://avatars.githubusercontent.com/u/161195912?v=4" width="100px;" alt="Phatds357"/><br />
        <sub><b>Phatds357</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/thanhlam110704">
        <img src="https://avatars.githubusercontent.com/u/144355432?v=4" width="100px;" alt="ThePinkKitten"/><br />
        <sub><b>thanhlam110704</b></sub>
      </a>
    </td>
  </tr>
</table>
