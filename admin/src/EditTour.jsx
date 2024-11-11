import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Autocomplete, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card, CardContent, Grid, IconButton, Paper, Divider,
    FormControl, InputLabel, Select, InputAdornment,
    Alert, Stack, Tooltip
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import TrainIcon from '@mui/icons-material/Train';

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

    const getTransportIcon = (transport) => {
        switch (transport) {
            case "Xe Buýt": return <DirectionsBusIcon />;
            case "Máy bay": return <FlightIcon />;
            case "Thuyền": return <DirectionsBoatIcon />;
            case "Tàu hoả": return <TrainIcon />;
            default: return <DirectionsBusIcon />;
        }
    };

    if (!tour) return <div>Loading...</div>;

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Card elevation={3}>
                <CardContent>
                    {/* Header */}
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => navigate('/tour')} sx={{ color: 'primary.main' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            Sửa Tour
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Thông tin cơ bản */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                                        Thông tin cơ bản
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Tên tour"
                                                name="tentour"
                                                fullWidth
                                                value={tour.tentour}
                                                onChange={handleChange}
                                                required
                                                error={!!errors.tentour}
                                                helperText={errors.tentour}
                                                sx={{ bgcolor: 'white' }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth sx={{ bgcolor: 'white' }}>
                                                <InputLabel>Loại tour</InputLabel>
                                                <Select
                                                    label="Loại tour"
                                                    name="loaitour"
                                                    value={tour.loaitour}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <MenuItem value="Tour trong nước">Tour trong nước</MenuItem>
                                                    <MenuItem value="Tour ngoài nước">Tour ngoài nước</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Giá"
                                                name="gia"
                                                type="number"
                                                fullWidth
                                                value={tour.gia}
                                                onChange={handleChange}
                                                required
                                                error={!!errors.gia}
                                                helperText={errors.gia}
                                                sx={{ bgcolor: 'white' }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AttachMoneyIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Số vé"
                                                name="sove"
                                                type="number"
                                                fullWidth
                                                value={tour.sove}
                                                onChange={handleChange}
                                                required
                                                error={!!errors.sove}
                                                helperText={errors.sove}
                                                sx={{ bgcolor: 'white' }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <ConfirmationNumberIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Địa điểm khởi hành"
                                                name="khoihanh"
                                                fullWidth
                                                value={tour.khoihanh}
                                                onChange={handleChange}
                                                required
                                                error={!!errors.khoihanh}
                                                helperText={errors.khoihanh}
                                                sx={{ bgcolor: 'white' }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LocationOnIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Thông tin chi tiết */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                                        Thông tin chi tiết
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Mô tả"
                                                name="mota"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={tour.mota}
                                                onChange={handleChange}
                                                required
                                                error={!!errors.mota}
                                                helperText={errors.mota}
                                                sx={{ bgcolor: 'white' }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth sx={{ bgcolor: 'white' }}>
                                                <InputLabel>Trạng thái vé</InputLabel>
                                                <Select
                                                    label="Trạng thái vé"
                                                    name="trangthai"
                                                    value={tour.trangthai}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="Còn vé">Còn vé</MenuItem>
                                                    <MenuItem value="Hết vé">Hết vé</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth sx={{ bgcolor: 'white' }}>
                                                <InputLabel>Phương tiện di chuyển</InputLabel>
                                                <Select
                                                    label="Phương tiện di chuyển"
                                                    name="phuongtiendichuyen"
                                                    value={tour.phuongtiendichuyen}
                                                    onChange={handleChange}
                                                    required
                                                    error={!!errors.phuongtiendichuyen}
                                                    IconComponent={() => getTransportIcon(tour.phuongtiendichuyen)}
                                                >
                                                    <MenuItem value="Xe Buýt">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <DirectionsBusIcon /> Xe Buýt
                                                        </Box>
                                                    </MenuItem>
                                                    <MenuItem value="Máy bay">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <FlightIcon /> Máy bay
                                                        </Box>
                                                    </MenuItem>
                                                    <MenuItem value="Thuyền">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <DirectionsBoatIcon /> Thuyền
                                                        </Box>
                                                    </MenuItem>
                                                    <MenuItem value="Tàu hoả">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <TrainIcon /> Tàu hoả
                                                        </Box>
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
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
                                                        sx={{ bgcolor: 'white' }}
                                                    />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box component="li" {...props}>
                                                        <Box>
                                                            <Typography>{option.tenlichtrinh}</Typography>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{ color: 'text.secondary' }}
                                                            >
                                                                {`${new Date(option.NGAYDI).toLocaleDateString('vi-VN')} - ${new Date(option.NGAYVE).toLocaleDateString('vi-VN')}`}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Hình ảnh */}
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                                        Hình ảnh tour
                                    </Typography>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <input
                                            accept="image/*"
                                            type="file"
                                            id="image-upload"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="image-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<ImageIcon />}
                                            >
                                                Chọn hình ảnh mới
                                            </Button>
                                        </label>

                                        {tour.hinhanh && (
                                            <Box sx={{ mt: 2, position: 'relative' }}>
                                                <img
                                                    src={`http://localhost:5000/${tour.hinhanh}`}
                                                    alt="Tour hiện tại"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '300px',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Buttons */}
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate("/tour")}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Cập nhật Tour
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditTour;