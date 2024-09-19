const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Thêm import cors

const app = express();
const port = 5000;

// Sử dụng middleware CORS
app.use(cors({
  origin: 'http://localhost:5173', // Cho phép yêu cầu từ địa chỉ này
  methods: ['GET', 'POST','PUT', 'DELETE'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type'] // Các header được phép
}));

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Thay đổi nếu cần
  password: '', // Thay đổi nếu cần
  database: 'quanlytour' // Thay đổi thành tên cơ sở dữ liệu của bạn
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.post('/loginAdmin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email và password là bắt buộc' });
  }

  // Truy vấn để lấy thông tin người dùng dựa trên email
  db.query('SELECT * FROM USER WHERE EMAIL = ? AND PASSWORD = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
    }

    const user = results[0];

    // Kiểm tra xem người dùng có phải là admin không
    if (user.ACCOUNTNAME !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    res.json({ message: 'Đăng nhập thành công!' });
  });
});

app.post('/add-schedule', (req, res) => {
    const { name, startDate, endDate, details } = req.body;
  
    // Kiểm tra dữ liệu
    if (!name || !startDate || !endDate || !details || details.length === 0) {
      return res.status(400).json({ message: 'Tên, ngày đi, ngày về và chi tiết là bắt buộc' });
    }
  
    // Thêm lịch trình vào cơ sở dữ liệu
    const scheduleQuery = 'INSERT INTO LichTrinh (tenlichtrinh, NGAYDI, NGAYVE) VALUES (?, ?, ?)';
    db.query(scheduleQuery, [name, startDate, endDate], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error adding schedule: ' + err.message });
  
      const scheduleId = result.insertId; // Lấy ID của lịch trình đã thêm
  
      // Thêm chi tiết vào bảng ChiTietLichTrinh
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
  
  // Lấy danh sách lịch trình
  app.get('/schedules', (req, res) => {
    const query = 'SELECT * FROM LichTrinh';
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching schedules: ' + err.message });
      res.json(results);
    });
  });
  
  // Lấy chi tiết lịch trình theo ID
  app.get('/schedules/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM ChiTietLichTrinh WHERE ID_LICH_TRINH = ?';
    db.query(query, [id], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching schedule details: ' + err.message });
      res.json(results);
    });
  });

  app.post('/add-tour', (req, res) => {
    const { tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen } = req.body;
    const query = 'INSERT INTO Tour (TENTOUR, LOAITOUR, GIA, SOVE, HINHANH, MOTA, TRANGTHAI, IDLICHTRINH, PHUONGTIENDICHUYEN) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Tour added successfully', id: result.insertId });
    });
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'src/img/tourImage');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });
  
  // Endpoints
  app.post('/upload-image', upload.single('image'), (req, res) => {
      res.json({ path: `src/img/tourImage/${req.file.filename}` });
  });
  
  app.post('/add-tour', (req, res) => {
      const { tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen } = req.body;
      const query = 'INSERT INTO Tour (TENTOUR, LOAITOUR, GIA, SOVE, HINHANH, MOTA, TRANGTHAI, IDLICHTRINH, PHUONGTIENDICHUYEN) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen], (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: 'Tour added successfully', id: result.insertId });
      });
  });
  
  // Endpoint lấy danh sách tour
// Endpoint lấy danh sách tour với thông tin lịch trình
app.get('/tours', (req, res) => {
    const query = `
        SELECT Tour.*, LichTrinh.NGAYDI, LichTrinh.NGAYVE 
        FROM Tour 
        JOIN LichTrinh ON Tour.IDLICHTRINH = LichTrinh.ID`;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching tours: ' + err.message });
        }
        res.json(results); // Trả về dữ liệu tour dưới dạng JSON
    });
});

app.use('/src/img/tourImage', express.static(path.join(__dirname, 'src/img/tourImage')));

app.get('/tours/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Tour WHERE ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]);
    });
});

app.put('/update-tour/:id', (req, res) => {
    const { id } = req.params;
    const { tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen } = req.body;
    const query = 'UPDATE Tour SET TENTOUR = ?, LOAITOUR = ?, GIA = ?, SOVE = ?, HINHANH = ?, MOTA = ?, TRANGTHAI = ?, IDLICHTRINH = ?, PHUONGTIENDICHUYEN = ? WHERE ID = ?';
    db.query(query, [tentour, loaitour, gia, sove, hinhanh, mota, trangthai, idlichtrinh, phuongtiendichuyen, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Tour updated successfully' });
    });
});

// Xoá tour
app.delete('/delete-tour/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Tour WHERE ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Tour deleted successfully' });
    });
});

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


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
