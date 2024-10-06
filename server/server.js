const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

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

// Add Schedule
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

// Get Schedule Details by ID
app.get('/schedules/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM ChiTietLichTrinh WHERE ID_LICH_TRINH = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching schedule details: ' + err.message });
    res.json(results);
  });
});

// Add tour
app.post('/add-tour', (req, res) => {
  const { tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen, khoihanh } = req.body; // Thêm 'khoihanh' vào destructuring
  const query = 'INSERT INTO Tour (TENTOUR, LOAITOUR, GIA, SOVE, HINHANH, MOTA, TRANGTHAI, IDLICHTRINH, PHUONGTIENDICHUYEN, KHOIHANH) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; // Thêm KHOIHANH vào câu query
  db.query(query, [tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen, khoihanh], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tour added successfully', id: result.insertId });
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
  const { tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen, khoihanh } = req.body; // Thêm khoihanh vào destructuring
  const query = 'UPDATE Tour SET TENTOUR = ?, LOAITOUR = ?, GIA = ?, SOVE = ?, HINHANH = ?, MOTA = ?, TRANGTHAI = ?, IDLICHTRINH = ?, PHUONGTIENDICHUYEN = ?, KHOIHANH = ? WHERE ID = ?'; // Thêm KHOIHANH vào câu query
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
    const token = jwt.sign({ id: user.ID }, 'your_secret_key');
    res.json({ message: 'Login successful!', token, userName: user.FULLNAME });
  });
});

// Get User Info
app.get('/user-info', authenticateToken, (req, res) => {
  const userId = req.userId;

  db.query('SELECT FULLNAME, PHONENUMBER, EMAIL FROM USER WHERE ID = ?', [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database query error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
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
  const query = 'SELECT FULLNAME, PHONENUMBER, EMAIL, ADDRESS FROM USER WHERE ID = ?';

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


// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
