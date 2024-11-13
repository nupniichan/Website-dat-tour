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
const schedule = require('node-schedule');

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
// API to get tour history for a specific user
app.get('/api/tour-history/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (!userId) {
      return res.status(400).json({ error: 'Invalid user ID' });
  }

  const sql = `
      SELECT v.ID, v.NGAYDAT, v.SOVE, v.LOAIVE, v.TINHTRANG, v.TONGTIEN, v.PHUONGTHUCTHANHTOAN, v.IDMAGIAMGIA, v.IDNGUOIDUNG, v.IDTOUR, v.GHICHU, v.SOVE_NGUOILON, v.SOVE_TREM, v.SOVE_EMBE 
      FROM ve v 
      JOIN tour t ON v.IDTOUR = t.ID 
      WHERE v.IDNGUOIDUNG = ?`;

  db.query(sql, [userId], (err, results) => {
      if (err) {
          console.error('Error executing query:', err.stack);
          return res.status(500).json({ error: 'Database query failed' });
          
      }
      res.json(results);
  });
});
// Hủy vé
app.post('/api/tour-history/cancel/:id', (req, res) => {
  const ticketId = req.params.id;
  const { reason } = req.body;

  const getTicketQuery = `
    SELECT v.*, t.IDLICHTRINH, l.NGAYDI 
    FROM ve v
    JOIN tour t ON v.IDTOUR = t.ID
    JOIN lichtrinh l ON t.IDLICHTRINH = l.ID
    WHERE v.ID = ?`;

  db.query(getTicketQuery, [ticketId], (err, ticketResults) => {
    if (err) {
      console.error('Lỗi khi lấy thông tin vé:', err);
      return res.status(500).json({ error: 'Lỗi khi hủy vé' });
    }

    if (ticketResults.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy vé để hủy' });
    }

    const ticket = ticketResults[0];
    
    // Kiểm tra trạng thái vé
    if (ticket.TINHTRANG === 'Đã hủy') {
      return res.status(400).json({ error: 'Vé đã được hủy trước đó' });
    }

    if (ticket.TINHTRANG === 'Đã hoàn tiền') {
      return res.status(400).json({ error: 'Vé đã được hoàn tiền trước đó' });
    }

    // Cho phép hủy vé nếu trạng thái là "Chưa thanh toán" hoặc kiểm tra điều kiện 24h
    if (ticket.TINHTRANG !== 'Chưa thanh toán') {
      const departureDate = new Date(ticket.NGAYDI);
      const now = new Date();
      const hoursDifference = (departureDate - now) / (1000 * 60 * 60);

      if (hoursDifference < 24) {
        return res.status(400).json({ 
          error: 'Không thể hủy vé trong vòng 24 giờ trước khi tour khởi hành',
          remainingHours: Math.floor(hoursDifference)
        });
      }
    }

    // Tính tổng số vé
    const totalTickets = parseInt(ticket.SOVE_NGUOILON || 0) + 
                        parseInt(ticket.SOVE_TREM || 0) + 
                        parseInt(ticket.SOVE_EMBE || 0);

    // Cập nhật trạng thái vé
    const updateTicketQuery = 'UPDATE ve SET TINHTRANG = ?, GHICHU = ? WHERE ID = ?';
    db.query(updateTicketQuery, ['Đã hủy', reason, ticketId], (error, results) => {
      if (error) {
        console.error('Lỗi khi cập nhật trạng thái vé:', error);
        return res.status(500).json({ error: 'Hủy vé thất bại' });
      }

      // Cập nhật số vé có sẵn trong tour
      const updateTourQuery = 'UPDATE tour SET SOVE = SOVE + ? WHERE ID = ?';
      db.query(updateTourQuery, [totalTickets, ticket.IDTOUR], (err, result) => {
        if (err) {
          console.error('Lỗi khi cập nhật SOVE trong Tour:', err);
          return res.status(500).json({ error: 'Lỗi khi cập nhật số vé trong tour' });
        }

        res.json({ 
          message: 'Hủy vé thành công',
          cancelTime: new Date(),
          departureTime: ticket.NGAYDI
        });
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
  
  const scheduleQuery = `
    SELECT * FROM LichTrinh WHERE ID = ?
  `;
  
  const detailsQuery = `
    SELECT * FROM ChiTietLichTrinh 
    WHERE ID_LICH_TRINH = ? 
    ORDER BY NGAY, GIO
  `;

  db.query(scheduleQuery, [id], (err, scheduleResults) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi lấy thông tin lịch trình' });
    }

    if (scheduleResults.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lịch trình' });
    }

    db.query(detailsQuery, [id], (detailsErr, detailsResults) => {
      if (detailsErr) {
        return res.status(500).json({ error: 'Lỗi khi lấy chi tiết lịch trình' });
      }

      res.json({
        ...scheduleResults[0],
        details: detailsResults
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

  // Cp nhật thông tin lịch trình
  const updateScheduleQuery = 'UPDATE LichTrinh SET tenlichtrinh = ?, NGAYDI = ?, NGAYVE = ? WHERE ID = ?';
  db.query(updateScheduleQuery, [req.body.name, startDate, endDate, id], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating schedule: ' + err.message });

    // Xa chi tiết cũ chỉ khi có chi tiết mới được gửi đến
    const deleteDetailsQuery = 'DELETE FROM ChiTietLichTrinh WHERE ID_LICH_TRINH = ?';
    db.query(deleteDetailsQuery, [id], (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting old schedule details: ' + err.message });

      // Bây giờ thêm các chi tit mi
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

    // Xa chi tiết cũ chỉ khi có chi tiết mới được gửi đến
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
  // Truy vấn này sẽ liên kết bảng Tour với bảng LichTrinh và lấy các trng cần thit
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
      res.json(results[0]); // Trả về thông tin tour đầu tiên, bao gồm ngy đi và ngày về
    } else {
      res.status(404).json({ message: 'Tour not found' }); // Không tìm thy tour với ID được cung cấp
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
  const tourId = req.params.id;

  // Kiểm tra xem tour có vé nào không
  const checkBookingQuery = 'SELECT COUNT(*) as count FROM ve WHERE IDTOUR = ?';
  
  db.query(checkBookingQuery, [tourId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi kiểm tra tour' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ 
        error: 'Không thể xóa tour này vì đã có người đặt vé' 
      });
    }

    // Nếu không có v nào, tiến hành xóa tour
    const deleteTourQuery = 'DELETE FROM tour WHERE ID = ?';
    db.query(deleteTourQuery, [tourId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Lỗi khi xóa tour' });
      }

      res.json({ message: 'Xóa tour thành công' });
    });
  });
});

// Delete Schedule
app.delete('/delete-schedule/:id', (req, res) => {
  const scheduleId = req.params.id;

  // Kiểm tra xem lịch trình có đang được sử dụng trong tour không
  const checkTourQuery = 'SELECT COUNT(*) as count FROM Tour WHERE IDLICHTRINH = ?';
  
  db.query(checkTourQuery, [scheduleId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi kiểm tra lịch trình' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ 
        error: 'Không thể xóa lịch trình này vì đang được sử dụng trong tour' 
      });
    }

    // Nếu không có tour nào sử dụng, tiến hành xóa
    const deleteDetailsQuery = 'DELETE FROM ChiTietLichTrinh WHERE ID_LICH_TRINH = ?';
    db.query(deleteDetailsQuery, [scheduleId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Lỗi khi xóa chi tiết lịch trình' });
      }

      const deleteScheduleQuery = 'DELETE FROM LichTrinh WHERE ID = ?';
      db.query(deleteScheduleQuery, [scheduleId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Lỗi khi xóa lịch trình' });
        }

        res.json({ message: 'Xóa lịch trình thành công' });
      });
    });
  });
});

// Register User
app.post('/register', (req, res) => {
  const { fullname, phoneNumber, email, address, dayOfBirth, accountName, password } = req.body;

  if (!fullname || !email || !password || !accountName) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Kiểm tra email trùng lặp
  const checkEmailQuery = 'SELECT * FROM USER WHERE EMAIL = ?';
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }
    
    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // Chèn dữ liệu nếu email chưa tồn tại
    const insertQuery = 'INSERT INTO USER (FULLNAME, PHONENUMBER, EMAIL, ADDRESS, DAYOFBIRTH, ACCOUNTNAME, PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [fullname, phoneNumber, email, address, dayOfBirth, accountName, password], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error: ' + err.message });
      }
      res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
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

          res.json({ message: 'Thm vé thành công', ticketId: newTicketId });
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

      if (ticket.TINHTRANG === 'Đã thanh ton') {
        const updateTourQuery = 'UPDATE Tour SET SOVE = SOVE + ? WHERE ID = ?';
        db.query(updateTourQuery, [totalTickets, tourId], (err, result) => {
          if (err) {
            console.error('Lỗi khi cập nht SOVE trong Tour:', err);
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
              console.error('Lỗi khi cập nht SOVE trong Tour:', err);
              return res.status(500).json({ error: 'Lỗi khi cập nhật số vé trong tour' });
            }
            res.json({ message: 'Cập nhật vé thành công' });
          });
        } else if (oldStatus === 'Đã thanh toán' && (TINHTRANG === 'Đã hủy' || TINHTRANG === 'Đã hoàn tiền')) {
          const updateTourQuery = 'UPDATE Tour SET SOVE = SOVE + ? WHERE ID = ?';
          db.query(updateTourQuery, [oldTotalTickets, IDTOUR], (err, result) => {
            if (err) {
              console.error('Lỗi khi cập nht SOVE trong Tour:', err);
              return res.status(500).json({ error: 'Lỗi khi cập nhật số vé trong tour' });
            }
            res.json({ message: 'Cập nhật vé thnh công' });
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

// API lấy thng tin vé theo ID
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

    res.json(results[0]); // Trả về thông tin vé đu tiên bao gồm FULLNAME của khách hàng
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
app.get('/users', (req, res) => {
  const query = `
    SELECT u.*
    FROM user u
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn", err);
      return res.status(500).json({ error: 'Lỗi truy vấn' });
    }
    res.json(results);
  });
});

// Lấy thông tin người dùng theo ID
app.get('/users', (req, res) => {
  const query = `
    SELECT *
    FROM user
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn", err);
      return res.status(500).json({ error: 'Lỗi truy vấn' });
    }
    res.json(results);
  });
});

// Lấy thông tin người dùng theo ID
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT FULLNAME, PHONENUMBER, EMAIL, ADDRESS, DAYOFBIRTH, ACCOUNTNAME FROM USER WHERE ID = ?';

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

app.post('/check-email', (req, res) => {
  const { email } = req.body;

  // Kiểm tra xem người dùng với cùng email đã tồn tại hay chưa
  const checkQuery = 'SELECT * FROM user WHERE EMAIL = ?';
  db.query(checkQuery, [email], (err, results) => {
      if (err) {
          console.error('Lỗi cơ sở dữ liệu:', err);
          return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu' });
      }

      if (results.length > 0) {
          // Nếu đã tồn tại người dùng với email này
          return res.status(409).json({ exists: true, message: 'Người dùng với email này đã tồn tại' });
      } else {
          // Nếu không có người dùng với email này
          return res.status(200).json({ exists: false, message: 'Email này có thể sử dụng' });
      }
  });
});

app.post('/check-phone', (req, res) => {
  const { phone } = req.body;

  // Kiểm tra xem người dùng với cùng số đin thoại đã tồn tại hay chưa
  const checkQuery = 'SELECT * FROM user WHERE PHONENUMBER = ?';
  db.query(checkQuery, [phone], (err, results) => {
      if (err) {
          console.error('Lỗi cơ sở dữ liệu:', err);
          return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu' });
      }

      if (results.length > 0) {
          // Nếu đã tn tại người dùng vi số điện thoại này
          return res.status(409).json({ exists: true, message: 'Người dùng với số điện thoại này đã tồn tại' });
      } else {
          // Nếu không có người dùng với số điện thoại này
          return res.status(200).json({ exists: false, message: 'Số điện thoại này có thể sử dụng' });
      }
  });
});

app.post('/check-accountname', (req, res) => {
  const { accountName } = req.body;

  // Kiểm tra xem người dùng với cùng tên tài khoản đã tồn tại hay chưa
  const checkQuery = 'SELECT * FROM user WHERE ACCOUNTNAME = ?';
  db.query(checkQuery, [accountName], (err, results) => {
      if (err) {
          console.error('Lỗi cơ sở dữ liệu:', err);
          return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu' });
      }

      if (results.length > 0) {
          // Nếu đã tồn tại ngưi dùng với tên tài khoản này
          return res.status(409).json({ exists: true, message: 'Người dùng với tên tài khoản này đã tồn tại' });
      } else {
          // Nếu không có người dùng với tên tài khoản này
          return res.status(200).json({ exists: false, message: 'Tên tài khoản này có thể sử dụng' });
      }
  });
});



app.post('/add-user', (req, res) => {
  const { fullname, phone, email, address, dayofbirth, accountname, password  } = req.body;
  // Chèn người dùng mới
  const query = 'INSERT INTO USER (FULLNAME, PHONENUMBER, EMAIL, ADDRESS, DAYOFBIRTH, ACCOUNTNAME, PASSWORD) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [fullname, phone, email, address, dayofbirth, accountname, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }
    res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
  });
});



app.put('/edit-user/:id', (req, res) => {
  const { id } = req.params;
  const {
    ID, FULLNAME, PHONENUMBER, EMAIL, ADDRESS, DAYOFBIRTH, ACCOUNTNAME
  } = req.body;

  // Lấy thông tin người dùng hiện tại
  const getOldUserQuery = 'SELECT * FROM user WHERE ID = ?';
  db.query(getOldUserQuery, [id], (err, oldUserResults) => {
    if (err) {
      console.error('Lỗi khi lấy thông tin người dùng:', err);
      return res.status(500).json({ error: 'Lỗi khi cập nhật người dùng' });
    }

    if (oldUserResults.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Cập nhật thông tin người dùng mà không bao gồm trường PASSWORD và ROLE
    const updateUserQuery = `
      UPDATE user 
      SET FULLNAME = ?, PHONENUMBER = ?, EMAIL = ?, ADDRESS = ?, DAYOFBIRTH = ?, ACCOUNTNAME = ?
      WHERE ID = ?
    `;

    db.query(updateUserQuery, [
      FULLNAME, PHONENUMBER, EMAIL, ADDRESS, DAYOFBIRTH, ACCOUNTNAME, id
    ], (err, result) => {
      if (err) {
        console.error('Lỗi khi cập nhật người dùng:', err);
        return res.status(500).json({ error: 'Lỗi khi cập nht người dùng' });
      }

      res.json({ message: 'Cập nhật người dùng thành công' });
    });
  });
});



app.delete('/delete-user/:id', (req, res) => {
  const userId = req.params.id;

  // Kiểm tra xem người dùng có đặt tour nào trong 12 tháng gần đây không
  const checkBookingQuery = `
    SELECT COUNT(*) as count 
    FROM ve 
    WHERE IDNGUOIDUNG = ? 
    AND NGAYDAT >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)`;
  
  db.query(checkBookingQuery, [userId], (err, results) => {
    if (err) {
      console.error('Lỗi kiểm tra vé:', err);
      return res.status(500).json({ 
        error: 'Lỗi khi kiểm tra thông tin đặt tour' 
      });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ 
        error: 'Không thể xóa người dùng này vì họ có đặt tour trong 12 tháng gần đây' 
      });
    }

    // Sửa tên bảng từ 'nguoidung' thành 'user'
    const deleteUserQuery = 'DELETE FROM user WHERE ID = ?';
    db.query(deleteUserQuery, [userId], (err) => {
      if (err) {
        console.error('Lỗi xóa người dùng:', err);
        return res.status(500).json({ 
          error: 'Lỗi khi xóa người dùng' 
        });
      }

      res.json({ message: 'Xóa người dùng thành công' });
    });
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
app.post('/callback', (req, res) => {
  const { resultCode, extraData } = req.body;

  if (resultCode === 0) { // Thanh toán thành công
    try {
      // Kiểm tra và parse extraData
      if (!extraData) {
        console.error('extraData không tồn tại');
        return res.redirect(config.failRedirectUrl); // Chuyển hướng tới trang thất bại
      }

      const paymentData = JSON.parse(extraData); // Parse extraData JSON
      
      // Kiểm tra các trường trong paymentData
      if (!paymentData || !paymentData.tourId || !paymentData.customerId) {
        console.error('Thiếu dữ liệu quan trọng trong extraData:', paymentData);
        return res.redirect(config.failRedirectUrl);
      }

      // Lưu thông tin vé vào database
      const ticketData = {
        IDTOUR: paymentData.tourId,
        IDNGUOIDUNG: paymentData.customerId,
        TONGTIEN: paymentData.amount,
        PHUONGTHUCTHANHTOAN: paymentData.paymentMethod,
        GHICHU: paymentData.customerNote || '',
        SOVE_NGUOILON: paymentData.adultCount,
        SOVE_TREM: paymentData.childCount,
        SOVE_EMBE: paymentData.infantCount,
        TINHTRANG: 'Đã thanh toán',
        NGAYDAT: new Date().toISOString(),
        LOAIVE: paymentData.ticketType,
        IDMAGIAMGIA: paymentData.discountId || null,
      };

      // Gọi API thêm vé vào cơ sở dữ liệu
      axios.post('http://localhost:5000/add-ticket', ticketData)
        .then(response => {
          res.redirect(config.redirectUrl); // Chuyển hướng tới trang thành công
        })
        .catch(error => {
          console.error('Lỗi khi lưu vé:', error);
          res.redirect(config.failRedirectUrl); // Chuyển hướng tới trang thất bại
        });
      
    } catch (error) {
      console.error('Lỗi khi xử lý callback:', error);
      res.redirect(config.failRedirectUrl); // Redirect to failed page
    }
  } else {
    // Thanh toán thất bại
    res.redirect(config.failRedirectUrl); // Chuyển hướng tới trang thất bại
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

// Fetch all reviews
app.get('/reviews', (req, res) => {
  const query = 'SELECT * FROM danhgia'; // Query to fetch reviews (adjust the table name and fields as needed)

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ error: 'Error fetching reviews' });
    }
    res.json(results); // Send the reviews as JSON response
  });
});

// Fetch review by id
app.get('/reviews/:id', (req, res) => {
  const reviewId = req.params.id;

  // Query the database for the review with the given ID
  const query = 'SELECT * FROM danhgia WHERE ID = ?'; // Modify the table and column names as per your schema
  db.query(query, [reviewId], (err, results) => {
    if (err) {
      console.error('Error fetching review:', err);
      res.status(500).json({ error: 'Error fetching review' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json(results[0]); // Send back the review data
  });
});
// Thêm đánh giá
app.post('/add-review', (req, res) => {
  const { tourId, userId, ticketId, rating, content } = req.body;
  
  console.log('Received review data:', { tourId, userId, ticketId, rating, content });

  // Validate input
  if (!tourId || !userId || !ticketId || !rating || !content) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      received: { tourId, userId, ticketId, rating, content }
    });
  }

  // Kiểm tra xem vé này đã được đánh giá chưa
  const checkQuery = `
    SELECT * FROM danhgia 
    WHERE IDTOUR = ? AND IDNGUOIDUNG = ? AND IDVE = ?
  `;

  db.query(checkQuery, [tourId, userId, ticketId], (err, results) => {
    if (err) {
      console.error('Check review error:', err);
      return res.status(500).json({ error: 'Không thể kiểm tra đánh giá', details: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Vé này đã được đánh giá' });
    }

    // Nếu chưa có đánh giá thì thêm mới
    const insertQuery = `
      INSERT INTO danhgia (IDTOUR, IDNGUOIDUNG, IDVE, SOSAO, NOIDUNG, thoigian)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const reviewDate = new Date('2024-11-10'); // Hoặc sử dụng ngày hiện tại: new Date()

    db.query(insertQuery, [
      tourId,
      userId,
      ticketId,
      rating,
      content,
      reviewDate
    ], (err, result) => {
      if (err) {
        console.error('Insert review error:', err);
        return res.status(500).json({ error: 'Không thể thêm đánh giá', details: err.message });
      }

      res.status(201).json({
        message: 'Đánh giá đã được thêm thành công',
        reviewId: result.insertId
      });
    });
  });
});

// Edit Review
app.put('/update-reviews/:id', (req, res) => {
  const reviewId = req.params.id; // Get the review ID from the URL parameters
  const { NOIDUNG, SOSAO, IDNGUOIDUNG, IDTOUR } = req.body; // Destructure the data from the request body

  // Check if all required fields are provided
  if (!NOIDUNG || !SOSAO || !IDNGUOIDUNG || !IDTOUR) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // SQL query to update the review
  const query = `
    UPDATE danhgia
    SET NOIDUNG = ?, SOSAO = ?, IDNGUOIDUNG = ?, IDTOUR = ?
    WHERE ID = ?
  `;

  // Execute the update query
  db.query(query, [NOIDUNG, SOSAO, IDNGUOIDUNG, IDTOUR, reviewId], (err, results) => {
    if (err) {
      console.error('Error updating review:', err);
      return res.status(500).json({ error: 'Error updating review' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully' });
  });
});

// Sửa đánh giá
app.put('/update-review/:id', (req, res) => {
  const reviewId = req.params.id;
  const { rating, content } = req.body;
  const userId = req.userId;

  const updateQuery = `
    UPDATE danhgia
    SET SOSAO = ?, NOIDUNG = ?
    WHERE ID = ? AND IDNGUOIDUNG = ?
  `;

  db.query(updateQuery, [rating, content, reviewId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi cập nhật đánh giá' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đánh giá hoặc bạn không có quyền sửa đánh giá này' });
    }

    res.json({ message: 'Đánh giá đã được cập nhật thành công' });
  });
});

// Xóa đánh giá
app.delete('/delete-review/:id', (req, res) => {
  const { id } = req.params;
  const deleteReviewQuery = 'DELETE FROM danhgia WHERE ID = ?';

  db.query(deleteReviewQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi xóa đánh giá' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm đánh giá để xóa' });
    }
    return res.status(200).json({ message: 'Đánh giá đã được xóa thành công' });
  });
});

// Lấy đánh giá cho một tour cụ thể
app.get('/reviews/:tourId', (req, res) => {
  const tourId = req.params.tourId;
  console.log('Received request for tour ID:', tourId); // Debug log

  const query = `
    SELECT d.ID, d.IDNGUOIDUNG, u.FULLNAME, d.SOSAO, d.NOIDUNG, d.IDVE, d.thoigian
    FROM danhgia d
    LEFT JOIN USER u ON d.IDNGUOIDUNG = u.ID
    WHERE d.IDTOUR = ?
  `;

  db.query(query, [tourId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy đánh giá' });
    }
    console.log('Found reviews:', results); // Debug log
    res.json(results);
  });
});

// Cái route này tui test thôi nếu đc thì lấy xài luôn :>
app.get('/api/tour/:id', (req, res) => {
  const tourId = req.params.id;
  const query = `
    SELECT t.*, l.NGAYDI, l.NGAYVE 
    FROM tour t
    JOIN lichtrinh l ON t.IDLICHTRINH = l.ID
    WHERE t.ID = ?
  `;
  
  db.query(query, [tourId], (err, results) => {
    if (err) {
      console.error('Error fetching tour:', err);
      return res.status(500).json({ error: 'Error fetching tour information' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    res.json(results[0]);
  });
});

  // GET: Fetch all discount codes
app.get('/api/discount-codes', (req, res) => {
  const sql = `
    SELECT *,
    CASE 
      WHEN CURDATE() > NGAYHETHAN THEN 'Hết hiệu lực'
      WHEN CURDATE() < NGAYAPDUNG THEN 'Chưa áp dụng'
      ELSE 'Đang áp dụng'
    END as TRANGTHAI
    FROM magiamgia
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
const getNextId = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT MAX(IDMAGIAMGIA) AS max_id FROM magiamgia', (err, results) => {
      if (err) {
        return reject(err);
      }
      const nextId = results[0].max_id ? results[0].max_id + 1 : 1;  // Start at 1 if no rows exist
      resolve(nextId);
    });
  });
};
// GET: Fetch a discount code by specific ID
app.get('/api/discount-codes/:id', (req, res) => {
  const discountId = req.params.id; // Get the ID from the URL params

  // Query the database for the discount with the provided ID
  const sql = 'SELECT * FROM magiamgia WHERE IDMAGIAMGIA = ?';
  
  db.query(sql, [discountId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // If no results found, return 404
    if (results.length === 0) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    // Return the discount data as JSON
    res.json(results[0]);
  });
});

// POST: Create a new discount code
app.post('/api/discount-codes', async (req, res) => {
  const { TENMGG, NGAYAPDUNG, NGAYHETHAN, DIEUKIEN, TILECHIETKHAU } = req.body;
  
  // Validate dates
  const currentDate = new Date();
  const applicationDate = new Date(NGAYAPDUNG);
  const expirationDate = new Date(NGAYHETHAN);

  if (applicationDate > expirationDate) {
    return res.status(400).json({ error: 'Ngày hết hạn phải sau ngày áp dụng' });
  }

  try {
    const nextId = await getNextId();
    
    // Xác định trạng thái ban đầu
    const initialStatus = currentDate > expirationDate ? 'Hết hiệu lực' : 
                         currentDate < applicationDate ? 'Chưa áp dụng' : 'Đang áp dụng';

    const query = `
      INSERT INTO magiamgia (IDMAGIAMGIA, TENMGG, NGAYAPDUNG, NGAYHETHAN, DIEUKIEN, TILECHIETKHAU, TRANGTHAI)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [nextId, TENMGG, NGAYAPDUNG, NGAYHETHAN, DIEUKIEN, TILECHIETKHAU, initialStatus], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to insert discount code' });
      }
      res.status(201).json({ message: 'Discount code created successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT: Update an existing discount code
app.put('/api/discount-codes/:id', (req, res) => {
  const { id } = req.params;
  const { TENMGG, NGAYAPDUNG, NGAYHETHAN, DIEUKIEN, TILECHIETKHAU } = req.body;

  // Validate dates
  const currentDate = new Date();
  const applicationDate = new Date(NGAYAPDUNG);
  const expirationDate = new Date(NGAYHETHAN);

  if (applicationDate > expirationDate) {
    return res.status(400).json({ error: 'Ngày hết hạn phải sau ngày áp dụng' });
  }

  // Xác định trạng thái mới
  const newStatus = currentDate > expirationDate ? 'Hết hiệu lực' : 
                   currentDate < applicationDate ? 'Chưa áp dụng' : 'Đang áp dụng';

  const sql = `
    UPDATE magiamgia
    SET TENMGG = ?, NGAYAPDUNG = ?, NGAYHETHAN = ?, DIEUKIEN = ?, TILECHIETKHAU = ?, TRANGTHAI = ?
    WHERE IDMAGIAMGIA = ?
  `;
  
  const values = [TENMGG, NGAYAPDUNG, NGAYHETHAN, DIEUKIEN, TILECHIETKHAU, newStatus, id];
  
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Discount code not found' });
    res.json({ message: 'Discount code updated successfully' });
  });
});

// Thêm task định kỳ để kiểm tra và hủy vé chưa thanh toán
schedule.scheduleJob('*/30 * * * *', () => { // Chạy mỗi 30 phút
  const query = `
    UPDATE ve 
    SET TINHTRANG = 'Đã hủy' 
    WHERE TINHTRANG = 'Chưa thanh toán' 
    AND TIMESTAMPDIFF(HOUR, NGAYDAT, NOW()) >= 24
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      console.error('Lỗi khi hủy vé quá hạn:', err);
    } else {
      console.log('Đã kiểm tra và hủy các vé quá hạn thanh toán');
    }
  });
});

// Check if user has reviewed a tour
app.get('/check-review', (req, res) => {
  const { userId, tourId, ticketId } = req.query;

  const query = `
    SELECT * FROM danhgia 
    WHERE IDTOUR = ? 
    AND IDNGUOIDUNG = ? 
    AND IDVE = ?
  `;

  db.query(query, [tourId, userId, ticketId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      hasReviewed: results.length > 0,
      review: results[0] || null
    });
  });
});

// Thêm endpoint để lấy chi tiết đánh giá
app.get('/get-review', (req, res) => {
  const { userId, tourId, ticketId } = req.query;
  
  const query = `
    SELECT * FROM danhgia 
    WHERE IDTOUR = ? 
    AND IDNGUOIDUNG = ? 
    AND IDVE = ?
  `;

  db.query(query, [tourId, userId, ticketId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Không thể lấy thông tin đánh giá' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đánh giá' });
    }

    res.json(results[0]);
  });
});

// API để lấy tổng doanh thu theo khoảng thời gian
// API để lấy tổng doanh thu theo khoảng thời gian
app.get('/api/income', (req, res) => {
  const { startDate, endDate } = req.query;
  
  // Log thông tin đầu vào
  console.log('Income API called with dates:', { startDate, endDate });

  // Kiểm tra tham số đầu vào
  if (!startDate || !endDate) {
    console.error('Missing required dates');
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  const query = `
    SELECT 
      DATE(NGAYDAT) as date,
      COUNT(*) as totalOrders,
      SUM(TONGTIEN) as totalIncome,
      SUM(CASE WHEN PHUONGTHUCTHANHTOAN = 'momo' THEN TONGTIEN ELSE 0 END) as momoIncome,
      SUM(CASE WHEN PHUONGTHUCTHANHTOAN = 'Tiền mặt' THEN TONGTIEN ELSE 0 END) as cashIncome
    FROM ve 
    WHERE TINHTRANG = 'Đã thanh toán'
    AND DATE(NGAYDAT) BETWEEN ? AND ?
    GROUP BY DATE(NGAYDAT)
    ORDER BY date`;

  // Log câu query để debug
  console.log('Executing query:', query);
  console.log('Query parameters:', [startDate, endDate]);

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message });
    }

    // Log kết quả
    console.log('Query results:', results);

    // Kiểm tra kết quả rỗng
    if (!results || results.length === 0) {
      console.log('No data found for the given date range');
      return res.json([]);
    }

    // Format lại kết quả để đảm bảo các giá trị số
    const formattedResults = results.map(row => ({
      ...row,
      totalOrders: Number(row.totalOrders),
      totalIncome: Number(row.totalIncome || 0),
      momoIncome: Number(row.momoIncome || 0),
      cashIncome: Number(row.cashIncome || 0)
    }));

    res.json(formattedResults);
  });
});

// API để lấy thống kê theo tour
app.get('/api/income/by-tour', (req, res) => {
  const { startDate, endDate } = req.query;
  
  // Log thông tin đầu vào
  console.log('Tour income API called with dates:', { startDate, endDate });

  // Kiểm tra tham số đầu vào
  if (!startDate || !endDate) {
    console.error('Missing required dates');
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  const query = `
    SELECT 
      t.TENTOUR,
      COUNT(v.ID) as totalOrders,
      SUM(v.TONGTIEN) as totalIncome
    FROM ve v
    JOIN tour t ON v.IDTOUR = t.ID
    WHERE v.TINHTRANG = 'Đã thanh toán'
    AND DATE(v.NGAYDAT) BETWEEN ? AND ?
    GROUP BY t.ID, t.TENTOUR
    ORDER BY totalIncome DESC`;

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message });
    }

    // Log kết quả chi tiết
    console.log('Raw results:', results);

    // Kiểm tra kết quả rỗng
    if (!results || results.length === 0) {
      console.log('No tour income data found for the given date range');
      return res.json([]);
    }

    // Format lại kết quả để đảm bảo các giá trị số
    const formattedResults = results.map(row => ({
      TENTOUR: row.TENTOUR,
      totalOrders: Number(row.totalOrders),
      totalIncome: Number(row.totalIncome || 0)
    }));

    // Log kết quả đã format
    console.log('Formatted results:', formattedResults);

    res.json(formattedResults);
  });
});

// API để lấy thống kê tổng quan
app.get('/api/dashboard/stats', (req, res) => {
  const queries = {
    // Chỉ lấy tổng số user
    userStats: `
      SELECT COUNT(*) as totalUsers FROM user
    `,
    
    // Tổng vé đã đặt và % thay đổi so với tuần trước
    bookingStats: `
      SELECT 
        (SELECT COUNT(*) FROM ve WHERE TINHTRANG = 'Đã thanh toán') as totalBookings,
        (SELECT COUNT(*) FROM ve WHERE TINHTRANG = 'Đã thanh toán' AND WEEK(NGAYDAT) = WEEK(CURRENT_DATE)) as currentWeekBookings,
        (SELECT COUNT(*) FROM ve WHERE TINHTRANG = 'Đã thanh toán' AND WEEK(NGAYDAT) = WEEK(CURRENT_DATE - INTERVAL 1 WEEK)) as lastWeekBookings
    `,
    
    // Tổng doanh thu và % thay đổi so với tuần trước
    revenueStats: `
      SELECT 
        (SELECT COALESCE(SUM(TONGTIEN), 0) FROM ve WHERE TINHTRANG = 'Đã thanh toán') as totalRevenue,
        (SELECT COALESCE(SUM(TONGTIEN), 0) FROM ve WHERE TINHTRANG = 'Đã thanh toán' AND WEEK(NGAYDAT) = WEEK(CURRENT_DATE)) as currentWeekRevenue,
        (SELECT COALESCE(SUM(TONGTIEN), 0) FROM ve WHERE TINHTRANG = 'Đã thanh toán' AND WEEK(NGAYDAT) = WEEK(CURRENT_DATE - INTERVAL 1 WEEK)) as lastWeekRevenue
    `,
    
    // Vé đã thanh toán và % thay đổi so với ngày hôm qua
    paidBookingStats: `
      SELECT 
        (SELECT COUNT(*) FROM ve WHERE TINHTRANG = 'Đã thanh toán') as paidBookings,
        (SELECT COUNT(*) FROM ve WHERE TINHTRANG = 'Đã thanh toán' AND DATE(NGAYDAT) = CURRENT_DATE) as currentDayPaidBookings,
        (SELECT COUNT(*) FROM ve WHERE TINHTRANG = 'Đã thanh toán' AND DATE(NGAYDAT) = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY)) as lastDayPaidBookings
    `
  };

  const stats = {};
  let completedQueries = 0;
  const totalQueries = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        return res.status(500).json({ error: 'Database query failed' });
      }

      const result = results[0];

      switch(key) {
        case 'userStats':
          stats.totalUsers = result.totalUsers;
          stats.userChangePercent = 0; // Không có so sánh cho users
          break;
        
        case 'bookingStats':
          stats.totalBookings = result.totalBookings;
          stats.bookingChangePercent = calculatePercentageChange(result.lastWeekBookings, result.currentWeekBookings);
          break;
        
        case 'revenueStats':
          stats.totalRevenue = result.totalRevenue;
          stats.revenueChangePercent = calculatePercentageChange(result.lastWeekRevenue, result.currentWeekRevenue);
          break;
        
        case 'paidBookingStats':
          stats.paidBookings = result.paidBookings;
          stats.paidBookingChangePercent = calculatePercentageChange(result.lastDayPaidBookings, result.currentDayPaidBookings);
          break;
      }

      completedQueries++;
      if (completedQueries === totalQueries) {
        res.json(stats);
      }
    });
  });
});

// Hàm tính phần trăm thay đổi
function calculatePercentageChange(oldValue, newValue) {
  oldValue = Number(oldValue) || 0;
  newValue = Number(newValue) || 0;
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

// API để lấy doanh số theo tháng
app.get('/api/dashboard/monthly-revenue', (req, res) => {
  const query = `
    SELECT 
      MONTH(NGAYDAT) as month,
      YEAR(NGAYDAT) as year,
      SUM(TONGTIEN) as revenue
    FROM ve
    WHERE TINHTRANG = 'Đã thanh toán'
    AND YEAR(NGAYDAT) = YEAR(CURRENT_DATE)
    GROUP BY YEAR(NGAYDAT), MONTH(NGAYDAT)
    ORDER BY year, month
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching monthly revenue:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// API để lấy danh sách vé gần đây
app.get('/api/dashboard/recent-bookings', (req, res) => {
  const query = `
    SELECT 
      v.ID,
      u.FULLNAME,
      v.NGAYDAT,
      v.SOVE,
      v.TONGTIEN,
      v.TINHTRANG
    FROM ve v
    JOIN user u ON v.IDNGUOIDUNG = u.ID
    ORDER BY v.NGAYDAT DESC
    LIMIT 5
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recent bookings:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// API để lấy doanh số theo năm
app.get('/api/dashboard/yearly-comparison', (req, res) => {
  const query = `
    SELECT 
      YEAR(NGAYDAT) as year,
      SUM(TONGTIEN) as revenue
    FROM ve
    WHERE TINHTRANG = 'Đã thanh toán'
    AND YEAR(NGAYDAT) >= YEAR(CURRENT_DATE) - 1
    GROUP BY YEAR(NGAYDAT)
    ORDER BY year
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching yearly comparison:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Thêm API endpoint để lấy danh sách tour và đánh giá trung bình
app.get('/tour-reviews', (req, res) => {
  const query = `
    SELECT 
      t.ID as tourId,
      t.TENTOUR as tourName,
      COUNT(d.ID) as totalReviews,
      AVG(d.SOSAO) as averageRating
    FROM tour t
    LEFT JOIN danhgia d ON t.ID = d.IDTOUR
    GROUP BY t.ID, t.TENTOUR
    ORDER BY t.ID
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi lấy đánh giá tour' });
    }
    res.json(results);
  });
});

// Lấy đánh giá cho một tour cụ thể
app.get('/api/reviews/:tourId', (req, res) => {
  const tourId = req.params.tourId;
  console.log('Fetching reviews for tour:', tourId);
  
  const query = `
    SELECT 
      d.ID,
      d.IDTOUR,
      d.IDNGUOIDUNG,
      d.IDVE,
      d.SOSAO,
      d.NOIDUNG,
      d.thoigian,
      u.FULLNAME
    FROM danhgia d
    LEFT JOIN user u ON d.IDNGUOIDUNG = u.ID
    WHERE d.IDTOUR = ?
    ORDER BY d.thoigian DESC
  `;

  db.query(query, [tourId], (err, results) => {
    if (err) {
      console.error('Error fetching review details:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy đánh giá' });
    }
    
    console.log('Found reviews:', results);
    res.json(results);
  });
});

// Thêm scheduled job để kiểm tra và cập nhật trạng thái mã giảm giá
schedule.scheduleJob('0 0 * * *', () => { // Chạy hàng ngày lúc 00:00
  const updateQuery = `
    UPDATE magiamgia 
    SET TRANGTHAI = 'Hết hiệu lực'
    WHERE NGAYHETHAN < CURDATE() 
    AND TRANGTHAI != 'Hết hiệu lực'
  `;
  
  db.query(updateQuery, (err, result) => {
    if (err) {
      console.error('Lỗi khi cập nhật trạng thái mã giảm giá:', err);
    } else {
      console.log('Đã cập nhật trạng thái các mã giảm giá hết hạn');
    }
  });
});

// API để lấy random featured tours
app.get('/api/featured-tours', (req, res) => {
  const query = `
    SELECT t.*, l.NGAYDI, l.NGAYVE,
           (SELECT AVG(SOSAO) FROM danhgia WHERE IDTOUR = t.ID) as rating,
           (SELECT COUNT(*) FROM danhgia WHERE IDTOUR = t.ID) as review_count
    FROM tour t
    JOIN lichtrinh l ON t.IDLICHTRINH = l.ID
    WHERE t.TRANGTHAI = 'Còn vé'
    AND l.NGAYDI > CURDATE()  /* Thêm điều kiện này để chỉ lấy tour có ngày đi trong tương lai */
    ORDER BY l.NGAYDI ASC     /* Sắp xếp theo ngày đi gần nhất */
    LIMIT 3
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching featured tours:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


