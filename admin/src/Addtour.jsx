import { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './AddTour.css'

const AddTour = () => {
    const [tour, setTour] = useState({
        tentour: '',
        loaitour: 'Tour trong nước',
        gia: '',
        sove: '',
        hinhanh: '',
        mota: '',
        khoihanh: '',
        trangthai: 'Còn vé',
        idlichtrinh: '',
        phuongtiendichuyen: 'Xe Buýt'
    });

    const [schedules, setSchedules] = useState([]);
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({
        tentour: '',
        loaitour: '',
        gia: '',
        sove: '',
        hinhanh: '',
        mota: '',
        khoihanh: '',
        trangthai: '',
        idlichtrinh: '',
        phuongtiendichuyen: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/schedules')
            .then(response => response.json())
            .then(data => setSchedules(data))
            .catch(err => console.error('Error fetching schedules:', err));
    }, []);

    const checkTourExists = async (tentour) => {
        try {
          const response = await fetch(`http://localhost:5000/check-tour-exists?tentour=${encodeURIComponent(tentour)}`);
          const data = await response.json();
          return data.exists;
        } catch (err) {
          console.error('Error checking if tour exists:', err);
          return false;
        }
    };

    const validateTentour = (value) => {
        if (!value.trim()) {
            return 'Trường bắt buộc nhập';
        } else if (/^\d+$/.test(value)) {
            return 'Tên tour không được chứa toàn số';
        }
        return '';
    };

    const validateGia = (value) => {
        const isNumber = /^[0-9]*\.?[0-9]+$/.test(value);
        if (!isNumber || !value.trim()) {
            return 'Giá phải là một số hợp lệ và không chứa ký tự đặc biệt';
        } else if (value <= 0) {
            return 'Giá phải lớn hơn 0';
        }
        return '';
    };

    const validateSove = (value) => {
        const isNumber = /^[0-9]+$/.test(value);
        if (!isNumber || !value.trim()) {
            return 'Số vé phải là một số hợp lệ và không chứa ký tự đặc biệt';
        } else if (parseInt(value, 10) <= 0) {
            return 'Số vé phải lớn hơn 0';
        }
        return '';
    };

    const validateRequiredField = (value, fieldName) => {
        if (typeof value !== 'string') {
            value = String(value);
        }

        if (!value.trim()) {
            return fieldName === 'idlichtrinh' ? 'Không được để trống' : 'Trường bắt buộc nhập';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTour(prev => ({ ...prev, [name]: value }));

        let error = '';
        if (name === 'tentour') {
            error = validateTentour(value);
        } else if (name === 'gia') {
            error = validateGia(value);
        } else if (name === 'sove') {
            error = validateSove(value);
        } else if (['mota', 'khoihanh', 'idlichtrinh', 'phuongtiendichuyen', 'trangthai'].includes(name)) {
            error = validateRequiredField(value, name);
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setErrors(prev => ({ ...prev, hinhanh: 'Trường bắt buộc nhập' }));
        } else {
            setErrors(prev => ({ ...prev, hinhanh: '' }));
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            const formData = new FormData();
            formData.append('image', file);
            fetch('http://localhost:5000/upload-image', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                setTour(prev => ({ ...prev, hinhanh: data.path }));
            })
            .catch(err => console.error('Error uploading image:', err));
        }
    };

    const validateFields = () => {
        const formErrors = {
            tentour: validateTentour(tour.tentour),
            gia: validateGia(tour.gia),
            sove: validateSove(tour.sove),
            mota: validateRequiredField(tour.mota, 'mota'),
            khoihanh: validateRequiredField(tour.khoihanh, 'khoihanh'),
            trangthai: validateRequiredField(tour.trangthai, 'trangthai'),
            idlichtrinh: validateRequiredField(tour.idlichtrinh, 'idlichtrinh'),
            phuongtiendichuyen: validateRequiredField(tour.phuongtiendichuyen, 'phuongtiendichuyen'),
            hinhanh: validateRequiredField(tour.hinhanh, 'hinhanh'),
        };
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateFields();

        if (Object.values(formErrors).every(error => !error)) {
            const isTourExists = await checkTourExists(tour.tentour);

            if (isTourExists) {
                setErrors(prev => ({ ...prev, tentour: 'This tour already exists' }));
            } else {
                // Proceed to add tour
                fetch('http://localhost:5000/add-tour', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(tour),
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.message);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Tour added:', data);
                    navigate('/');
                })
                .catch(err => {
                    console.error('Error adding tour:', err);
                    setErrors(prev => ({ ...prev, tentour: err.message }));
                });
            }
        } else {
            setErrors(formErrors);
        }
    };


    return (
        <Box className="form-container">
            <h3>Thêm Tour Mới</h3>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Tên tour"
                    name="tentour"
                    fullWidth
                    onChange={handleChange}
                    required
                    error={!!errors.tentour}
                    helperText={errors.tentour}
                    className="text-field"
                />

                <TextField
                    select
                    label="Loại tour"
                    name="loaitour"
                    fullWidth
                    onChange={handleChange}
                    required
                    value={tour.loaitour || ''}
                    error={!!errors.loaitour}
                    helperText={errors.loaitour}
                    className="text-field"
                >
                    <MenuItem value="Tour trong nước">Tour trong nước</MenuItem>
                    <MenuItem value="Tour ngoài nước">Tour ngoài nước</MenuItem>
                </TextField>

                <TextField
                    label="Giá"
                    name="gia"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                    required
                    value={tour.gia || ''}
                    error={!!errors.gia}
                    helperText={errors.gia}
                    className="text-field"
                />
                <TextField
                    label="Số vé"
                    name="sove"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                    required
                    value={tour.sove || ''}
                    error={!!errors.sove}
                    helperText={errors.sove}
                    className="text-field"
                />
                <TextField
                    label="Mô tả"
                    name="mota"
                    fullWidth
                    onChange={handleChange}
                    required
                    value={tour.mota || ''}
                    error={!!errors.mota}
                    helperText={errors.mota}
                    className="text-field"
                />

                <TextField
                    label="Địa điểm khởi hành"
                    name="khoihanh"
                    fullWidth
                    onChange={handleChange}
                    required
                    value={tour.khoihanh || ''}
                    error={!!errors.khoihanh}
                    helperText={errors.khoihanh}
                    className="text-field"
                />

                <TextField
                    select
                    label="Trạng thái vé"
                    name="trangthai"
                    fullWidth
                    onChange={handleChange}
                    value={tour.trangthai || ''}
                    className="text-field"
                >
                    <MenuItem value="Còn vé">Còn vé</MenuItem>
                    <MenuItem value="Hết vé">Hết vé</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Chọn lịch trình"
                    name="idlichtrinh"
                    fullWidth
                    onChange={handleChange}
                    required
                    value={tour.idlichtrinh || ''}
                    error={!!errors.idlichtrinh}
                    helperText={errors.idlichtrinh}
                    className="text-field"
                >
                    {schedules.map(schedule => (
                        <MenuItem key={schedule.ID} value={schedule.ID}>
                            {schedule.tenlichtrinh}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Phương tiện di chuyển"
                    name="phuongtiendichuyen"
                    fullWidth
                    onChange={handleChange}
                    required
                    value={tour.phuongtiendichuyen || ''}
                    error={!!errors.phuongtiendichuyen}
                    helperText={errors.phuongtiendichuyen}
                    className="text-field"
                >
                    <MenuItem value="Xe Buýt">Xe Buýt</MenuItem>
                    <MenuItem value="Máy bay">Máy bay</MenuItem>
                    <MenuItem value="Thuyền">Thuyền</MenuItem>
                    <MenuItem value="Tàu hoả">Tàu hoả</MenuItem>
                </TextField>

                <input
                    type="file"
                    onChange={handleImageUpload}
                    required
                    className="text-field"
                />

                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                    />
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="submit-button"
                >
                    Lưu
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/')}
                >
                    Hủy
                </Button>
            </form>
        </Box>
    );
};

export default AddTour;
