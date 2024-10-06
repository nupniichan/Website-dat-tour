import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddTour = () => {
    const [tour, setTour] = useState({
        tentour: '',
        loaitour: '',
        gia: '',
        sove: '',
        hinhanh: '',
        mota: '',
        khoihanh: '',  // Trường khởi hành mới
        trangthai: 'Còn vé',
        idlichtrinh: '',
        phuongtiendichuyen: ''
    });
    const [schedules, setSchedules] = useState([]);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/schedules')
            .then(response => response.json())
            .then(data => setSchedules(data))
            .catch(err => console.error('Error fetching schedules:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTour(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/add-tour', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tour),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Tour added:', data);
            navigate('/');
        })
        .catch(err => console.error('Error adding tour:', err));
    };

    return (
        <Box padding={3}>
            <h3>Thêm Tour Mới</h3>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Tên tour"
                    name="tentour"
                    fullWidth
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }} 
                />
                <TextField
                    select
                    label="Loại tour"
                    name="loaitour"
                    fullWidth
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
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
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    label="Số vé"
                    name="sove"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    label="Mô tả"
                    name="mota"
                    fullWidth
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    label="Địa điểm khởi hành"
                    name="khoihanh"
                    fullWidth
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    select
                    label="Trạng thái vé"
                    name="trangthai"
                    fullWidth
                    onChange={handleChange}
                    value={tour.trangthai}
                    style={{ marginBottom: '10px' }}
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
                    style={{ marginBottom: '10px' }}
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
                    style={{ marginBottom: '10px' }}
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
                    style={{ marginBottom: '10px' }}
                />
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                )}
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>Lưu</Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>Hủy</Button>
            </form>
        </Box>
    );
};

export default AddTour;
