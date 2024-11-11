import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Card, CardContent,
  Grid, Paper, IconButton, InputAdornment, Alert,
  Tooltip, Divider, List, ListItem, ListItemText,
  ListItemSecondaryAction, Collapse
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import TitleIcon from '@mui/icons-material/Title';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const EditSchedule = () => {
  const { id } = useParams();
  const [schedule, setSchedule] = useState({
    name: '',
    startDate: '',
    endDate: '',
    details: [],
  });
  const [eventDate, setEventDate] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [descriptionContent, setDescriptionContent] = useState('');
  const [editingDetailIndex, setEditingDetailIndex] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/schedules/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Dữ liệu nhận được:', data);
        setSchedule({
          name: data.schedule.tenlichtrinh || '',
          startDate: data.schedule.NGAYDI || '',
          endDate: data.schedule.NGAYVE || '',
          details: data.details || [],  // Sử dụng chi tiết từ dữ liệu mới
        });
      })
      .catch(err => console.error('Error fetching schedule:', err));
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    if (name === 'eventDate') setEventDate(value);
    if (name === 'eventContent') setEventContent(value);
    if (name === 'eventTime') setEventTime(value);
    if (name === 'descriptionContent') setDescriptionContent(value);
  };

  const validateForm = () => {
    let tempErrors = {};
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startDate = new Date(schedule.startDate);
    const endDate = new Date(schedule.endDate);

    // Validate tên lịch trình
    if (!schedule.name.trim()) {
      tempErrors.name = "Tên lịch trình không được để trống";
    }

    // Validate ngày đi
    if (!schedule.startDate) {
      tempErrors.startDate = "Ngày đi không được để trống";
    } else if (startDate < currentDate) {
      tempErrors.startDate = "Ngày đi không được là ngày trong quá khứ";
    }

    // Validate ngày về
    if (!schedule.endDate) {
      tempErrors.endDate = "Ngày về không được để trống";
    } else {
      if (endDate < currentDate) {
        tempErrors.endDate = "Ngày về không được là ngày trong quá khứ";
      }
      if (endDate < startDate) {
        tempErrors.endDate = "Ngày về phải sau ngày đi";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateDetail = () => {
    let tempErrors = {};

    if (!eventDate) {
      tempErrors.eventDate = "Ngày không được để trống";
    } else {
      const detailDate = new Date(eventDate);
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      
      if (!schedule.startDate || !schedule.endDate) {
        tempErrors.eventDate = "Vui lòng nhập ngày đi và ngày về trước";
      } else if (detailDate < startDate || detailDate > endDate) {
        tempErrors.eventDate = "Ngày phải nằm trong khoảng thời gian của lịch trình";
      }
    }

    if (!eventTime) {
      tempErrors.eventTime = "Thời gian không được để trống";
    }

    if (!eventContent.trim()) {
      tempErrors.eventContent = "Sự kiện không được để trống";
    }

    setErrors(prev => ({ ...prev, ...tempErrors }));
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddDetail = () => {
    if (validateDetail()) {
      if (editingDetailIndex !== null) {
        const updatedDetails = [...schedule.details];
        updatedDetails[editingDetailIndex] = {
          NGAY: eventDate,
          SUKIEN: eventContent,
          MOTA: descriptionContent,
          GIO: eventTime
        };
        
        // Sắp xếp lại chi tiết theo thời gian
        const sortedDetails = updatedDetails.sort((a, b) => {
          const dateA = new Date(`${a.NGAY} ${a.GIO}`);
          const dateB = new Date(`${b.NGAY} ${b.GIO}`);
          return dateA - dateB;
        });

        setSchedule(prev => ({ ...prev, details: sortedDetails }));
        setEditingDetailIndex(null);
      } else {
        const newDetail = {
          NGAY: eventDate,
          SUKIEN: eventContent,
          MOTA: descriptionContent,
          GIO: eventTime
        };

        // Thêm và sắp xếp chi tiết mới
        setSchedule(prev => {
          const updatedDetails = [...prev.details, newDetail].sort((a, b) => {
            const dateA = new Date(`${a.NGAY} ${a.GIO}`);
            const dateB = new Date(`${b.NGAY} ${b.GIO}`);
            return dateA - dateB;
          });
          return { ...prev, details: updatedDetails };
        });
      }

      // Reset form
      setEventDate('');
      setEventContent('');
      setEventTime('');
      setDescriptionContent('');
    }
  };

  const handleEditDetail = (index) => {
    const detail = schedule.details[index];
    setEventDate(detail.NGAY);
    setEventContent(detail.SUKIEN);
    setEventTime(detail.GIO);
    setDescriptionContent(detail.MOTA);
    setEditingDetailIndex(index);
  };

  const handleDeleteDetail = (index) => {
    setSchedule(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Dữ liệu gửi đi:', schedule);
    fetch(`http://localhost:5000/update-schedule/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Cập nhật thành công:', data);
        navigate('/schedule-management');
      })
      .catch(err => console.error('Error updating schedule:', err));
  };
  
  const handleDeleteSchedule = () => {
    fetch(`http://localhost:5000/delete-schedule/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        navigate('/schedule-management');
      })
      .catch(err => console.error('Error deleting schedule:', err));
  };

  const formattedStartDate = schedule.startDate ? schedule.startDate.slice(0, 10) : '';
  const formattedEndDate = schedule.endDate ? schedule.endDate.slice(0, 10) : '';

  // Thêm hàm format date
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    
    // Nếu dateString chứa T hoặc Z, lấy phần ngày
    if (dateString.includes('T')) {
        dateString = dateString.split('T')[0];
    }
    
    // Chuyển trực tiếp từ YYYY-MM-DD sang DD/MM/YYYY
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Card elevation={3}>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/schedule')} sx={{ color: 'primary.main' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Chỉnh Sửa Lịch Trình
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
                        label="Tên lịch trình"
                        name="name"
                        value={schedule.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TitleIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày đi"
                        name="startDate"
                        type="date"
                        value={formattedStartDate}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày về"
                        name="endDate"
                        type="date"
                        value={formattedEndDate}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{ bgcolor: 'white' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Chi tiết lịch trình */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      Chi tiết lịch trình
                    </Typography>
                    <IconButton onClick={() => setExpanded(!expanded)}>
                      {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={expanded}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Ngày"
                          type="date"
                          fullWidth
                          name="eventDate"
                          value={eventDate}
                          onChange={handleDetailChange}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.eventDate}
                          helperText={errors.eventDate}
                          sx={{ bgcolor: 'white' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EventIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Giờ"
                          type="time"
                          fullWidth
                          name="eventTime"
                          value={eventTime}
                          onChange={handleDetailChange}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.eventTime}
                          helperText={errors.eventTime}
                          required
                          sx={{ bgcolor: 'white' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccessTimeIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Sự kiện"
                          fullWidth
                          name="eventContent"
                          value={eventContent}
                          onChange={handleDetailChange}
                          error={!!errors.eventContent}
                          helperText={errors.eventContent}
                          required
                          sx={{ bgcolor: 'white' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DescriptionIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Mô tả"
                          fullWidth
                          multiline
                          rows={3}
                          name="descriptionContent"
                          value={descriptionContent}
                          onChange={handleDetailChange}
                          sx={{ bgcolor: 'white' }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DescriptionIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddDetail}
                          startIcon={editingDetailIndex !== null ? <SaveIcon /> : <AddIcon />}
                          fullWidth
                        >
                          {editingDetailIndex !== null ? 'Cập nhật chi tiết' : 'Thêm chi tiết'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Collapse>

                  {/* Danh sách chi tiết */}
                  <List sx={{ mt: 2 }}>
                    {schedule.details.length > 0 ? (
                      schedule.details.map((detail, index) => (
                        <Paper key={index} sx={{ mb: 2, bgcolor: 'white' }}>
                          <ListItem
                            sx={{
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              py: 2
                            }}
                          >
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                                {formatDisplayDate(detail.NGAY)} - {detail.GIO}
                              </Typography>
                              <Box>
                                <IconButton color="primary" onClick={() => handleEditDetail(index)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDeleteDetail(index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {detail.SUKIEN}
                            </Typography>
                            {detail.MOTA && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {detail.MOTA}
                              </Typography>
                            )}
                          </ListItem>
                        </Paper>
                      ))
                    ) : (
                      <Alert severity="info">Chưa có chi tiết nào</Alert>
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>

            {/* Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteSchedule}
                startIcon={<DeleteIcon />}
              >
                Xóa lịch trình
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/schedule')}
                  startIcon={<CancelIcon />}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                >
                  Cập nhật
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditSchedule;
