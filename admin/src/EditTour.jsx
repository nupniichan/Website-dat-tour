import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditTour = () => {
    const { id } = useParams();
    const [tour, setTour] = useState({
        tentour: '',
        loaitour: '',
        gia: '',
        sove: '',
        hinhanh: '',
        mota: '',
        trangthai: 'Còn vé',
        idlichtrinh: '',
        phuongtiendichuyen: ''
    });
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy dữ liệu tour cần sửa
        fetch(`http://localhost:5000/tours/${id}`)
            .then(response => response.json())
            .then(data => {
                setTour({
                    tentour: data.TENTOUR,
                    loaitour: data.LOAITOUR,
                    gia: data.GIA,
                    sove: data.SOVE,
                    hinhanh: data.HINHANH,
                    mota: data.MOTA,
                    trangthai: data.TRANGTHAI,
                    idlichtrinh: data.IDLICHTRINH,
                    phuongtiendichuyen: data.PHUONGTIENDICHUYEN
                });
            })
            .catch(err => console.error('Error fetching tour:', err));

        // Lấy danh sách lịch trình
        fetch('http://localhost:5000/schedules')
            .then(response => response.json())
            .then(data => setSchedules(data))
            .catch(err => console.error('Error fetching schedules:', err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTour((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        fetch('http://localhost:5000/upload-image', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setTour((prev) => ({ ...prev, hinhanh: data.path }));
            })
            .catch(err => console.error('Error uploading image:', err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/update-tour/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tour),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Tour updated:', data);
            navigate('/'); 
        })
        .catch(err => console.error('Error updating tour:', err));
    };

    if (!tour) return <div>Loading...</div>;

    return (
        <Box padding={3}>
            <h3>Sửa Tour</h3>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Tên tour"
                    name="tentour"
                    fullWidth
                    value={tour.tentour}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    label="Loại tour"
                    name="loaitour"
                    fullWidth
                    value={tour.loaitour}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    label="Giá"
                    name="gia"
                    type="number"
                    fullWidth
                    value={tour.gia}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    label="Số vé"
                    name="sove"
                    type="number"
                    fullWidth
                    value={tour.sove}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    label="Mô tả"
                    name="mota"
                    fullWidth
                    value={tour.mota}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    select
                    label="Trạng thái vé"
                    name="trangthai"
                    fullWidth
                    value={tour.trangthai}
                    onChange={handleChange}
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
                    value={tour.idlichtrinh}
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
                    value={tour.phuongtiendichuyen}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '10px' }}
                >
                    <MenuItem value="Xe buýt">Xe Buýt</MenuItem>
                    <MenuItem value="Máy bay">Máy bay</MenuItem>
                    <MenuItem value="Thuyền">Thuyền</MenuItem>
                    <MenuItem value="Tàu hoả">Tàu hoả</MenuItem>
                </TextField>

                <input
                    type="file"
                    onChange={handleImageUpload}
                    style={{ marginBottom: '10px' }}
                />
                {/* Hiển thị hình ảnh hiện tại */}
                {tour.hinhanh && (
                    <div style={{ marginBottom: '10px' }}>
                        <img src={`http://localhost:5000/${tour.hinhanh}`} alt="Tour hiện tại" width="100%" />
                    </div>
                )}
                <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>Cập nhật</Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate('/tour')}>Hủy</Button>
            </form>
        </Box>
    );
};

export default EditTour;
