import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Autocomplete, Typography } from '@mui/material';
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
        khoihanh: '', // Thêm trường khởi hành
        trangthai: 'Còn vé',
        idlichtrinh: '',
        phuongtiendichuyen: ''
    });
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        tentour: "",
        loaitour: "",
        gia: "",
        sove: "",
        hinhanh: "",
        mota: "",
        khoihanh: "",
        trangthai: "",
        idlichtrinh: "",
        phuongtiendichuyen: "",
    });

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
                    khoihanh: data.KHOIHANH, // Nhớ thêm trường khoihanh
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

        let error = "";
        if (name === "tentour") {
            error = validateTentour(value);
        } else if (name === "gia") {
            error = validateGia(value);
        } else if (name === "sove") {
            error = validateSove(value);
        } else if (
            ["mota", "khoihanh", "idlichtrinh", "phuongtiendichuyen", "trangthai"].includes(name)
        ) {
            error = validateRequiredField(value, name);
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
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
        const formErrors = validateFields();

        if (Object.values(formErrors).every((error) => !error)) {
            fetch(`http://localhost:5000/update-tour/${id}`, {
                method: 'PUT',
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
                console.log('Tour updated:', data);
                navigate('/tour'); 
            })
            .catch(err => {
                console.error('Error updating tour:', err);
                alert('Có lỗi xảy ra khi cập nhật tour');
            });
        } else {
            setErrors(formErrors);
        }
    };

    const validateTentour = (value) => {
        if (!value.trim()) {
            return "Trường bắt buộc nhập";
        } else if (/^\d+$/.test(value)) {
            return "Tên tour không được chứa toàn số";
        }
        return "";
    };

    const validateGia = (value) => {
        const isNumber = /^[0-9]*\.?[0-9]+$/.test(value);
        if (!isNumber || !value.trim()) {
            return "Giá phải là một số hợp lệ và không chứa ký tự đặc biệt";
        } else if (value <= 0) {
            return "Giá phải lớn hơn 0";
        }
        return "";
    };

    const validateSove = (value) => {
        const isNumber = /^[0-9]+$/.test(value);
        if (!isNumber || !value.trim()) {
            return "Số vé phải là một số hợp lệ và không chứa ký tự đặc biệt";
        } else if (parseInt(value, 10) <= 0) {
            return "Số vé phải lớn hơn 0";
        }
        return "";
    };

    const validateRequiredField = (value, fieldName) => {
        if (typeof value !== "string") {
            value = String(value);
        }
        if (!value.trim()) {
            return fieldName === "idlichtrinh"
                ? "Không được để trống"
                : "Trường bắt buộc nhập";
        }
        return "";
    };

    const validateFields = () => {
        const formErrors = {
            tentour: validateTentour(tour.tentour),
            gia: validateGia(tour.gia),
            sove: validateSove(tour.sove),
            mota: validateRequiredField(tour.mota, "mota"),
            khoihanh: validateRequiredField(tour.khoihanh, "khoihanh"),
            trangthai: validateRequiredField(tour.trangthai, "trangthai"),
            idlichtrinh: validateRequiredField(tour.idlichtrinh, "idlichtrinh"),
            phuongtiendichuyen: validateRequiredField(tour.phuongtiendichuyen, "phuongtiendichuyen"),
        };
        return formErrors;
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
                    error={!!errors.tentour}
                    helperText={errors.tentour}
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    select
                    label="Loại tour"
                    name="loaitour"
                    fullWidth
                    value={tour.loaitour}
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
                    label="Địa điểm khởi hành"
                    name="khoihanh"
                    fullWidth
                    value={tour.khoihanh}
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
                <Autocomplete
                    options={schedules}
                    getOptionLabel={(option) => option.tenlichtrinh}
                    value={schedules.find(schedule => schedule.ID === tour.idlichtrinh) || null}
                    onChange={(event, newValue) => {
                        handleChange({
                            target: {
                                name: 'idlichtrinh',
                                value: newValue ? newValue.ID : ''
                            }
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn lịch trình"
                            error={!!errors.idlichtrinh}
                            helperText={errors.idlichtrinh}
                            required
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>
                            <Box>
                                <Typography>{option.tenlichtrinh}</Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        color: 'text.secondary'
                                    }}
                                >
                                    {`${new Date(option.NGAYDI).toLocaleDateString('vi-VN')} - ${new Date(option.NGAYVE).toLocaleDateString('vi-VN')}`}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    isOptionEqualToValue={(option, value) => option.ID === value.ID}
                    noOptionsText="Không tìm thấy lịch trình phù hợp"
                />
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
