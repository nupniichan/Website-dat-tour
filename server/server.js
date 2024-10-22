const express = require('express');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('./config');
const session = require('express-session');
const app = express();
const port = 5000;

// Middleware CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4800'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Middleware phục vụ tệp tĩnh
app.use('/src/img/tourImage', express.static(path.join(__dirname, 'src/img/tourImage')));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quanlytour'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.sendStatus(401); // No token, return 401

  jwt.verify(token, 'your_secret_key', (err, user) => { // Replace 'your_secret_key' with your actual secret
    if (err) return res.sendStatus(403); // Invalid token, return 403
    req.userId = user.id; // Set user ID from token
    next(); // Proceed to the next middleware/route handler
  });
};

//Xem lịch sử tour
app.get('/api/tour-history', (req, res) => {
  const query = 'SELECT * FROM ve';

  db.query(query, (error, results) => {
    if (error) {
      console.error('Database query failed:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results || []);
  });
});

// Hủy vé
app.post('/api/tour-history/cancel/:id', (req, res) => {
  const ticketId = req.params.id;

  const getTicketQuery = 'SELECT * FROM ve WHERE ID = ?';
  db.query(getTicketQuery, [ticketId], (err, ticketResults) => {
    if (err) {
      console.error('Lỗi khi lấy thông tin vé:', err);
      return res.status(500).json({ error: 'Lỗi khi hủy vé' });
    }

    if (ticketResults.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy vé để hủy' });
    }

    const ticket = ticketResults[0];
    const totalTickets = ticket.SOVE_NGUOILON + ticket.SOVE_TREM + ticket.SOVE_EMBE;
    const tourId = ticket.IDTOUR;

    const updateTicketQuery = 'UPDATE ve SET TINHTRANG = ? WHERE ID = ?';
    db.query(updateTicketQuery, ['Đã hủy', ticketId], (error, results) => {
      if (error) {
        console.error('Lỗi khi cập nhật trạng thái vé:', error);
        return res.status(500).json({ error: 'Hủy vé thất bại' });
      }

      const updateTourQuery = 'UPDATE Tour SET SOVE = SOVE + ? WHERE ID = ?';
      db.query(updateTourQuery, [totalTickets, tourId], (err, result) => {
        if (err) {
          console.error('Lỗi khi cập nhật SOVE trong Tour:', err);
          return res.status(500).json({ error: 'Lỗi khi cập nhật số vé trong tour' });
        }

        res.json({ message: 'Hủy vé thành công' });
      });
    });
  });
});

// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  const query = 'SELECT * FROM USER WHERE EMAIL = ? AND PASSWORD = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials!' });
    }

    const user = results[0];
    req.session.userId = user.ID;
    res.json({ message: 'Login successful!', userName: user.FULLNAME, ID: user.ID });
  });
});


// Login Admin
app.post('/loginAdmin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email và password là bắt buộc' });
  }

  db.query('SELECT * FROM USER WHERE EMAIL = ? AND PASSWORD = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
    }

    const user = results[0];

    if (user.ACCOUNTNAME !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    res.json({ message: 'Đăng nhập thành công!' });
  });
});

// thêm lịch trình
app.post('/add-schedule', (req, res) => {
  const { name, startDate, endDate, details } = req.body;

  if (!name || !startDate || !endDate || !details || details.length === 0) {
    return res.status(400).json({ message: 'Tên, ngày đi, ngày về và chi tiết là bắt buộc' });
  }

  const scheduleQuery = 'INSERT INTO LichTrinh (tenlichtrinh, NGAYDI, NGAYVE) VALUES (?, ?, ?)';
  db.query(scheduleQuery, [name, startDate, endDate], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding schedule: ' + err.message });

    const scheduleId = result.insertId;

    const detailQueries = details.map(detail => {
      return new Promise((resolve, reject) => {
        const detailQuery = 'INSERT INTO ChiTietLichTrinh (ID_LICH_TRINH, NGAY, SUKIEN, MOTA, GIO) VALUES (?, ?, ?, ?, ?)';
        db.query(detailQuery, [scheduleId, detail.date, detail.content, detail.description, detail.time], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });

    Promise.all(detailQueries)
      .then(() => res.json({ message: 'Schedule added successfully!' }))
      .catch(err => res.status(500).json({ message: 'Error adding schedule details: ' + err.message }));
  });
});

// Get Schedules
app.get('/schedules', (req, res) => {
  const query = 'SELECT * FROM LichTrinh';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching schedules: ' + err.message });
    res.json(results);
  });
});

// Lấy thông tin lịch trình và chi tiết lịch trình theo ID
app.get('/schedules/:id', (req, res) => {
  const { id } = req.params;

  // Truy vấn lấy thông tin lịch trình
  const scheduleQuery = 'SELECT * FROM LichTrinh WHERE ID = ?';
  const detailsQuery = 'SELECT * FROM ChiTietLichTrinh WHERE ID_LICH_TRINH = ?';

  db.query(scheduleQuery, [id], (err, scheduleResults) => {
    if (err) return res.status(500).json({ message: 'Error fetching schedule: ' + err.message });
    if (scheduleResults.length === 0) return res.status(404).json({ message: 'Schedule not found' });

    // Lấy chi tiết lịch trình
    db.query(detailsQuery, [id], (err, detailsResults) => {
      if (err) return res.status(500).json({ message: 'Error fetching schedule details: ' + err.message });

      // Trả về thông tin lịch trình và chi tiết
      res.json({
        schedule: scheduleResults[0],
        details: detailsResults,
      });
    });
  });
});

// Update Schedule
app.put('/update-schedule/:id', (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, details } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Ngày đi và ngày về là bắt buộc' });
  }

  // Cập nhật thông tin lịch trình
  const updateScheduleQuery = 'UPDATE LichTrinh SET tenlichtrinh = ?, NGAYDI = ?, NGAYVE = ? WHERE ID = ?';
  db.query(updateScheduleQuery, [req.body.name, startDate, endDate, id], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating schedule: ' + err.message });

    // Xóa chi tiết cũ chỉ khi có chi tiết mới được gửi đến
    const deleteDetailsQuery = 'DELETE FROM ChiTietLichTrinh WHERE ID_LICH_TRINH = ?';
    db.query(deleteDetailsQuery, [id], (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting old schedule details: ' + err.message });

      // Bây giờ thêm các chi tiết mới
      const detailQueries = details.map(detail => {
        return new Promise((resolve, reject) => {
          const insertDetailQuery = 'INSERT INTO ChiTietLichTrinh (ID_LICH_TRINH, NGAY, SUKIEN, MOTA, GIO) VALUES (?, ?, ?, ?, ?)';
          db.query(insertDetailQuery, [id, detail.NGAY, detail.SUKIEN, detail.MOTA, detail.GIO], (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });

      Promise.all(detailQueries)
        .then(() => res.json({ message: 'Schedule updated successfully!' }))
        .catch(err => res.status(500).json({ message: 'Error adding new schedule details: ' + err.message }));
    });
  });
});

// Update Schedule
app.put('/update-schedule/:id', (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, details } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Ngày đi và ngày về là bắt buộc' });
  }

  // Cập nhật thông tin lịch trình
  const updateScheduleQuery = 'UPDATE LichTrinh SET tenlichtrinh = ?, NGAYDI = ?, NGAYVE = ? WHERE ID = ?';
  db.query(updateScheduleQuery, [req.body.name, startDate, endDate, id], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating schedule: ' + err.message });

    // Xóa chi tiết cũ chỉ khi có chi tiết mới được gửi đến
    const deleteDetailsQuery = 'DELETE FROM ChiTietLichTrinh WHERE ID_LICH_TRINH = ?';
    db.query(deleteDetailsQuery, [id], (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting old schedule details: ' + err.message });

      // Bây giờ thêm các chi tiết mới
      const detailQueries = details.map(detail => {
        return new Promise((resolve, reject) => {
          const insertDetailQuery = 'INSERT INTO ChiTietLichTrinh (ID_LICH_TRINH, NGAY, SUKIEN, MOTA, GIO) VALUES (?, ?, ?, ?, ?)';
          db.query(insertDetailQuery, [id, detail.NGAY, detail.SUKIEN, detail.MOTA, detail.GIO], (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });

      Promise.all(detailQueries)
        .then(() => res.json({ message: 'Schedule updated successfully!' }))
        .catch(err => res.status(500).json({ message: 'Error adding new schedule details: ' + err.message }));
    });
  });
});

// Add tour
app.post('/add-tour', (req, res) => {
  const { tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen, khoihanh } = req.body;

  // Check if a tour with the same name exists
  const checkQuery = 'SELECT * FROM Tour WHERE TENTOUR = ?';
  db.query(checkQuery, [tentour], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
          // If a tour with the same name exists, return an error
          return res.status(400).json({ message: 'Tour with this name already exists' });
      } else {
          // If no duplicates, insert the new tour
          const insertQuery = 'INSERT INTO Tour (TENTOUR, LOAITOUR, GIA, SOVE, HINHANH, MOTA, TRANGTHAI, IDLICHTRINH, PHUONGTIENDICHUYEN, KHOIHANH) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          db.query(insertQuery, [tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen, khoihanh], (err, result) => {
              if (err) {
                  return res.status(500).json({ error: err.message });
              }
              res.json({ message: 'Tour added successfully', id: result.insertId });
          });
      }
  });
});


// Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/img/tourImage');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload Image Endpoint
app.post('/upload-image', upload.single('image'), (req, res) => {
  res.json({ path: `src/img/tourImage/${req.file.filename}` });
});

// Get Tours
app.get('/tours', (req, res) => {
  const query = `
      SELECT Tour.*, LichTrinh.NGAYDI, LichTrinh.NGAYVE 
      FROM Tour 
      JOIN LichTrinh ON Tour.IDLICHTRINH = LichTrinh.ID`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tours: ' + err.message });
    }
    res.json(results);
  });
});

// Check if tour already exists
app.get('/check-tour-exists', (req, res) => {
  const { tentour } = req.query;

  if (!tentour) {
      return res.status(400).json({ exists: false, message: 'Tên tour là bắt buộc' });
  }

  const query = 'SELECT * FROM Tour WHERE TENTOUR = ?';
  db.query(query, [tentour], (err, results) => {
      if (err) {
          return res.status(500).json({ exists: false, message: 'Database error' });
      }

      if (results.length > 0) {
          return res.status(200).json({ exists: true, message: 'Tour đã tồn tại' });
      } else {
          return res.status(200).json({ exists: false, message: 'Tour không tồn tại' });
      }
  });
});



// Get Tour by ID
app.get('/tours/:id', (req, res) => {
  const { id } = req.params;
  // Truy vấn này sẽ liên kết bảng Tour với bảng LichTrinh và lấy các trường cần thiết
  const query = `
    SELECT Tour.*, LichTrinh.NGAYDI, LichTrinh.NGAYVE 
    FROM Tour 
    JOIN LichTrinh ON Tour.IDLICHTRINH = LichTrinh.ID 
    WHERE Tour.ID = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.json(results[0]); // Trả về thông tin tour đầu tiên, bao gồm ngày đi và ngày về
    } else {
      res.status(404).json({ message: 'Tour not found' }); // Không tìm thấy tour với ID được cung cấp
    }
  });
});


// Update Tour
app.put('/update-tour/:id', (req, res) => {
  const { id } = req.params;
  const { tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen, khoihanh } = req.body; 
  const query = 'UPDATE Tour SET TENTOUR = ?, LOAITOUR = ?, GIA = ?, SOVE = ?, HINHANH = ?, MOTA = ?, TRANGTHAI = ?, IDLICHTRINH = ?, PHUONGTIENDICHUYEN = ?, KHOIHANH = ? WHERE ID = ?'; 
  db.query(query, [tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen, khoihanh, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tour updated successfully' });
  });
});

// Delete Tour
app.delete('/delete-tour/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Tour WHERE ID = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tour deleted successfully' });
  });
});

// Delete Schedule
app.delete('/delete-schedule/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM LichTrinh WHERE ID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Schedule deleted successfully' });
  });
});

// Register User
app.post('/register', (req, res) => {
  const { fullname, phoneNumber, email, address, dayOfBirth, accountName, password } = req.body;

  if (!fullname || !email || !password || !accountName) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  const query = 'INSERT INTO USER (FULLNAME, PHONENUMBER, EMAIL, ADDRESS, DAYOFBIRTH, ACCOUNTNAME, PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [fullname, phoneNumber, email, address, dayOfBirth, accountName, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }
    res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
  });
});

// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  const query = 'SELECT * FROM USER WHERE EMAIL = ? AND PASSWORD = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials!' });
    }

    const user = results[0];
    req.session.userId = user.ID;
    res.json({ message: 'Login successful!', userName: user.FULLNAME, ID: user.ID });
  });
});

app.get('/session', (req, res) => {
  if (req.session.userId) {
    res.json({ userId: req.session.userId });
  } else {
    res.status(404).json({ message: 'No session information found.' });
  }
});

// Ticket
app.post('/add-ticket', (req, res) => {
  const {
    IDTOUR, IDNGUOIDUNG, TONGTIEN, PHUONGTHUCTHANHTOAN,
    SOVE_NGUOILON, SOVE_TREM, SOVE_EMBE, GHICHU, TINHTRANG, NGAYDAT, LOAIVE, IDMAGIAMGIA
  } = req.body;
  
  const getLastTicketQuery = `SELECT ID FROM ve ORDER BY ID DESC LIMIT 1`;

  db.query(getLastTicketQuery, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy mã vé cuối cùng:', err);
      return res.status(500).json({ error: 'Lỗi khi thêm vé' });
    }

    let lastTicketId = results.length > 0 ? results[0].ID : 'TKOD00000';
    let lastTicketNumber = lastTicketId.match(/\d+/);

    lastTicketNumber = lastTicketNumber ? parseInt(lastTicketNumber[0]) : 0;
    const newTicketId = `TKOD${(lastTicketNumber + 1).toString().padStart(5, '0')}`;

    const query = `
      INSERT INTO ve (ID, IDTOUR, IDNGUOIDUNG, TONGTIEN, PHUONGTHUCTHANHTOAN, SOVE_NGUOILON, SOVE_TREM, SOVE_EMBE, SOVE, GHICHU, TINHTRANG, NGAYDAT, LOAIVE, IDMAGIAMGIA)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const totalTickets = SOVE_NGUOILON + SOVE_TREM + SOVE_EMBE;

    db.query(query, [
      newTicketId, IDTOUR, IDNGUOIDUNG, TONGTIEN, PHUONGTHUCTHANHTOAN,
      SOVE_NGUOILON, SOVE_TREM, SOVE_EMBE, totalTickets,
      GHICHU, TINHTRANG, NGAYDAT, LOAIVE, IDMAGIAMGIA
    ], (err, result) => {
      if (err) {
        console.error('Lỗi khi thêm vé:', err);
        return res.status(500).json({ error: 'Lỗi khi thêm vé' });
      }

      if (TINHTRANG === 'Đã thanh toán') {
        const updateTourQuery = 'UPDATE Tour SET SOVE = SOVE - ? WHERE ID = ?';
        db.query(updateTourQuery, [totalTickets, IDTOUR], (err, result) => {
          if (err) {
            console.error('Lỗi khi cập nhật SOVE trong Tour:', err);
            return res.status(500).json({ error: 'Lỗi khi cập nhật số vé trong tour' });
          }

          res.json({ message: 'Thêm vé thành công', ticketId: newTicketId });
        });
      } else {
        res.json({ message: 'Thêm vé thành công', ticketId: newTicketId });
      }
    });
  });
});

app.delete('/delete-ticket/:id', (req, res) => {
  const { id } = req.params;

  const getTicketQuery = 'SELECT * FROM ve WHERE ID = ?';
  db.query(getTicketQuery, [id], (err, ticketResults) => {
    if (err) {
      console.error('Lỗi khi lấy thông tin vé:', err);
      return res.status(500).json({ error: 'Lỗi khi xóa vé' });
    }

    if (ticketResults.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy vé để xóa' });
    }

    const ticket = ticketResults[0];
    const totalTickets = ticket.SOVE_NGUOILON + ticket.SOVE_TREM + ticket.SOVE_EMBE;
    const tourId = ticket.IDTOUR;

    const deleteTicketQuery = 'DELETE FROM ve WHERE ID = ?';
    db.query(deleteTicketQuery, [id], (err, result) => {
      if (err) {
        console.error('Lỗi khi xóa vé:', err);
        return res.status(500).json({ error: 'Lỗi khi xóa vé' });
      }

      if (ticket.TINHTRANG === 'Đã thanh toán') {
        const updateTourQuery = 'UPDATE Tour SET SOVE = SOVE + ? WHERE ID = ?';
        db.query(updateTourQuery, [totalTickets, tourId], (err, result) => {
          if (err) {
            console.error('Lỗi khi cập nhật SOVE trong Tour:', err);
            return res.status(500).json({ error: 'Lỗi khi cập nhật số vé trong tour' });
          }

          res.json({ message: 'Xóa vé thành công' });
        });
      } else {
        res.json({ message: 'Xóa vé thành công' });
      }
    });
  });
});


app.put('/update-ticket/:id', (req, res) => {
  const { id } = req.params;
  const {
    IDTOUR, IDNGUOIDUNG, TONGTIEN, PHUONGTHUCTHANHTOAN, 
    SOVE_NGUOILON, SOVE_TREM, SOVE_EMBE, GHICHU, TINHTRANG, NGAYDAT, LOAIVE, IDMAGIAMGIA
  } = req.body;

  const getOldTicketQuery = 'SELECT * FROM ve WHERE ID = ?';
  db.query(getOldTicketQuery, [id], (err, oldTicketResults) => {
    if (err) {
      console.error('Lỗi khi lấy thông tin vé cũ:', err);
      return res.status(500).json({ error: 'Lỗi khi cập nhật vé' });
    }

    if (oldTicketResults.length === 0) {
      return res.status(404).json({ message: 'Vé không tồn tại' });
    }

    const oldTicket = oldTicketResults[0];
    const oldStatus = oldTicket.TINHTRANG;
    const oldTotalTickets = oldTicket.SOVE_NGUOILON + oldTicket.SOVE_TREM + oldTicket.SOVE_EMBE;

    const newTotalTickets = SOVE_NGUOILON + SOVE_TREM + SOVE_EMBE;

    const updateTicketQuery = `
      UPDATE ve 
      SET IDTOUR = ?, IDNGUOIDUNG = ?, TONGTIEN = ?, PHUONGTHUCTHANHTOAN = ?, SOVE_NGUOILON = ?, SOVE_TREM = ?, SOVE_EMBE = ?, SOVE = ?, GHICHU = ?, TINHTRANG = ?, NGAYDAT = ?, LOAIVE = ?, IDMAGIAMGIA = ?
      WHERE ID = ?
    `;

    db.query(updateTicketQuery, [
      IDTOUR, IDNGUOIDUNG, TONGTIEN, PHUONGTHUCTHANHTOAN,
      SOVE_NGUOILON, SOVE_TREM, SOVE_EMBE, newTotalTickets,
      GHICHU, TINHTRANG, NGAYDAT, LOAIVE, IDMAGIAMGIA, id
    ], (err, result) => {
      if (err) {
        console.error('Lỗi khi cập nhật vé:', err);
        return res.status(500).json({ error: 'Lỗi khi cập nhật vé' });
      }

      if (oldStatus !== TINHTRANG) {
        if (oldStatus !== 'Đã thanh toán' && TINHTRANG === 'Đã thanh toán') {
          const updateTourQuery = 'UPDATE Tour SET SOVE = SOVE - ? WHERE ID = ?';
          db.query(updateTourQuery, [newTotalTickets, IDTOUR], (err, result) => {
            if (err) {
              console.error('Lỗi khi cập nhật SOVE trong Tour:', err);
              return res.status(500).json({ error: 'Lỗi khi cập nhật số vé trong tour' });
            }
            res.json({ message: 'Cập nhật vé thành công' });
          });
        } else if (oldStatus === 'Đã thanh toán' && (TINHTRANG === 'Đã hủy' || TINHTRANG === 'Đã hoàn tiền')) {
          const updateTourQuery = 'UPDATE Tour SET SOVE = SOVE + ? WHERE ID = ?';
          db.query(updateTourQuery, [oldTotalTickets, IDTOUR], (err, result) => {
            if (err) {
              console.error('Lỗi khi cập nhật SOVE trong Tour:', err);
              return res.status(500).json({ error: 'Lỗi khi cập nhật số vé trong tour' });
            }
            res.json({ message: 'Cập nhật vé thành công' });
          });
        } else {
          res.json({ message: 'Cập nhật vé thành công' });
        }
      } else {
        res.json({ message: 'Cập nhật vé thành công' });
      }
    });
  });
});

app.get('/tickets', (req, res) => {
  const query = `
    SELECT ve.*, USER.FULLNAME 
    FROM ve 
    JOIN USER ON ve.IDNGUOIDUNG = USER.ID
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn", err);
      return res.status(500).json({ error: 'Lỗi truy vấn' });
    }
    res.json(results);
  });
});

// API lấy thông tin vé theo ID
app.get('/tickets/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT ve.*, USER.FULLNAME 
    FROM ve 
    JOIN USER ON ve.IDNGUOIDUNG = USER.ID
    WHERE ve.ID = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy thông tin vé:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy thông tin vé' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Vé không tồn tại' });
    }

    res.json(results[0]); // Trả về thông tin vé đầu tiên bao gồm FULLNAME của khách hàng
  });
});


// API tìm kiếm dữ liệu
app.get('/search', (req, res) => {
  const searchTerm = req.query.q || ''; // Tên tour
  const departureDate = req.query.date; // Ngày đi từ query

  // Câu truy vấn SQL
  const sql = `
      SELECT t.*, l.NGAYDI, l.NGAYVE
      FROM tour t
      INNER JOIN lichtrinh l ON t.IDLICHTRINH = l.ID
      WHERE t.TENTOUR LIKE ? 
      ${departureDate ? 'AND l.NGAYDI = ?' : ''}
  `;

  // Tạo mảng giá trị cho truy vấn
  const values = [`%${searchTerm}%`];
  if (departureDate) {
      values.push(departureDate); // Thêm ngày đi nếu có
  }

  db.query(sql, values, (err, results) => {
      if (err) {
          console.error('Lỗi truy vấn:', err);
          return res.status(500).json({ error: 'Lỗi truy vấn' });
      }
      res.json(results);
  });
});

// API tìm kiếm tour theo tên
app.get('/search/tour', (req, res) => {
  const searchTerm = req.query.q || ''; // Tên tour

  // Câu truy vấn SQL
  const sql = `
      SELECT t.*, l.NGAYDI, l.NGAYVE
      FROM Tour t
      INNER JOIN LichTrinh l ON t.IDLICHTRINH = l.ID
      WHERE t.TENTOUR LIKE ?
  `;

  db.query(sql, [`%${searchTerm}%`], (err, results) => {
      if (err) {
          console.error('Lỗi truy vấn:', err);
          return res.status(500).json({ error: 'Lỗi truy vấn' });
      }
      res.json(results);
  });
});

// API tìm kiếm tour theo tên và ngày đi
app.get('/search/tour-with-date', (req, res) => {
  const searchTerm = req.query.q || ''; // Tên tour
  const departureDate = req.query.date; // Ngày đi từ query

  // Câu truy vấn SQL
  const sql = `
      SELECT t.*, l.NGAYDI, l.NGAYVE
      FROM Tour t
      INNER JOIN LichTrinh l ON t.IDLICHTRINH = l.ID
      WHERE t.TENTOUR LIKE ? 
      AND l.NGAYDI = ?
  `;

  db.query(sql, [`%${searchTerm}%`, departureDate], (err, results) => {
      if (err) {
          console.error('Lỗi truy vấn:', err);
          return res.status(500).json({ error: 'Lỗi truy vấn' });
      }
      res.json(results);
  });
});

// User ( còn thiếu thêm, xoá, sửa )
// Lấy thông tin người dùng theo ID
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT FULLNAME, PHONENUMBER, EMAIL, ADDRESS, DAYOFBIRTH FROM USER WHERE ID = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu: ' + err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.json(results[0]); // Trả về thông tin người dùng đầu tiên
  });
});
// Cập nhật thông tin người dùng
app.put('/update/user/:id', (req, res) => {
  const userId = req.params.id;
  const { FULLNAME, PHONENUMBER, EMAIL, ADDRESS, DAYOFBIRTH } = req.body;

  const query = `
    UPDATE USER
    SET FULLNAME = ?, ADDRESS = ?, DAYOFBIRTH = ?
    WHERE ID = ?
  `;

  db.query(query, [FULLNAME, ADDRESS, DAYOFBIRTH, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi cập nhật cơ sở dữ liệu: ' + err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Trả về thông tin người dùng đã cập nhật
    const updatedUser = {
      ID: userId,
      FULLNAME,
      PHONENUMBER,
      EMAIL,
      ADDRESS,
      DAYOFBIRTH,
    };
    res.json(updatedUser);
  });
});

// API MOMO
app.post('/payment', async (req, res) => {
  const { amount, orderInfo, extraData } = req.body; // Nhận extraData từ request body
  const orderId = config.partnerCode + new Date().getTime();
  const requestId = orderId;

  // Tạo chữ ký và xử lý thanh toán
  const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${config.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${requestId}&requestType=${config.requestType}`;
  const signature = crypto.createHmac('sha256', config.secretKey).update(rawSignature).digest('hex');

  const requestBody = {
    partnerCode: config.partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: config.redirectUrl,
    ipnUrl: config.ipnUrl,
    lang: config.lang,
    requestType: config.requestType,
    extraData: extraData, // Truyền extraData vào đây
    signature: signature,
  };

  try {
    const result = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
});

// Trả kết quả từ momo về
// Trả kết quả từ momo về
app.post('/callback', (req, res) => {
  const { resultCode, extraData } = req.body;

  // ResultCode == 0: Thanh toán thành công
  // ResultCode != 0: Thanh toán thất bại
  if (resultCode === 0) {
    // Thanh toán thành công
    try {
      const paymentData = JSON.parse(extraData); // Lấy dữ liệu thanh toán từ extraData

      // Lưu thông tin vé vào database
      const ticketData = {
        tourId: paymentData.tourId,
        customerId: paymentData.customerId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        note: paymentData.customerNote,
        adultCount: paymentData.adultCount,
        childCount: paymentData.childCount,
        infantCount: paymentData.infantCount,
        status: 'Thanh toán thành công',
        bookingDate: new Date(),
        ticketType: paymentData.ticketType,
        discountId: null
      };

      // Gọi API thêm vé vào cơ sở dữ liệu
      axios.post('http://localhost:5000/add-ticket', ticketData)
        .then(response => {
          res.redirect(config.redirectUrl); // Redirect to success page
        })
        .catch(error => {
          console.error('Lỗi khi lưu vé:', error);
          res.redirect(config.failRedirectUrl); // Redirect to failed page
        });

    } catch (error) {
      console.error('Lỗi khi xử lý callback:', error);
      res.redirect(config.failRedirectUrl); // Redirect to failed page
    }
  } else {
    // Thanh toán thất bại
    res.redirect(config.failRedirectUrl); // Redirect to failed page
  }
});


app.post('/check-status-transaction', async (req, res) => {
  const { orderId } = req.body;

  // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
  // &requestId=$requestId
  var secretKey = config.secretKey;
  var accessKey = config.accessKey;
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: 'MOMO',
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: 'vi',
  });

  // options for axios
  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/query',
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
  };

  const result = await axios(options);

  return res.status(200).json(result.data);
});

// Route prepare-payment - Lưu dữ liệu vào session trước khi thanh toán
app.post('/prepare-payment', (req, res) => {
  const { tourId, userId, adultCount, childCount, infantCount, customerNote, totalPrice, tourType } = req.body;

  // Lưu thông tin vào session
  req.session.tourId = tourId;
  req.session.userId = userId;
  req.session.adultCount = adultCount;
  req.session.childCount = childCount;
  req.session.infantCount = infantCount;
  req.session.customerNote = customerNote;
  req.session.totalPrice = totalPrice;
  req.session.tourType = tourType;

  res.json({ message: 'Session data saved successfully' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
