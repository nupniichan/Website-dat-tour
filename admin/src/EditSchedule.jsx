import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';

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
    <Box padding={3}>
      <h3>Sửa Lịch Trình</h3>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên lịch trình"
          name="name"
          fullWidth
          value={schedule.name}
          onChange={handleChange}
          required
          error={!!errors.name}
          helperText={errors.name}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Ngày đi"
          name="startDate"
          type="date"
          fullWidth
          value={formattedStartDate}
          onChange={handleChange}
          required
          error={!!errors.startDate}
          helperText={errors.startDate}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Ngày về"
          name="endDate"
          type="date"
          fullWidth
          value={formattedEndDate}
          onChange={handleChange}
          required
          error={!!errors.endDate}
          helperText={errors.endDate}
          style={{ marginBottom: '10px' }}
        />

        <h4>Chi tiết lịch trình</h4>
        <TextField
          label="Ngày"
          type="date"
          fullWidth
          name="eventDate"
          value={eventDate}
          onChange={handleDetailChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.eventDate}
          helperText={errors.eventDate}
        />
        <TextField
          label="Giờ"
          type="time"
          fullWidth
          name="eventTime"
          value={eventTime}
          onChange={handleDetailChange}
          margin="normal"
          error={!!errors.eventTime}
          helperText={errors.eventTime}
          required
        />
        <TextField
          label="Sự kiện"
          fullWidth
          name="eventContent"
          value={eventContent}
          onChange={handleDetailChange}
          margin="normal"
          error={!!errors.eventContent}
          helperText={errors.eventContent}
          required
        />
        <TextField
          label="Mô tả"
          fullWidth
          name="descriptionContent"
          value={descriptionContent}
          onChange={handleDetailChange}
          margin="normal"
        />
        <IconButton color="primary" onClick={handleAddDetail}>
          <AddIcon />
        </IconButton>

        <ul>
          {schedule.details.length ? (
            schedule.details.map((detail, index) => (
              <li key={index}>
                {`Ngày ${formatDisplayDate(detail.NGAY)} - ${detail.GIO}: ${detail.SUKIEN || 'Chưa có sự kiện'}`}
                {detail.MOTA && ` - Mô tả: ${detail.MOTA}`}
                <IconButton color="primary" onClick={() => handleEditDetail(index)}>
                  Sửa
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteDetail(index)}>
                  Xoá
                </IconButton>
              </li>
            ))
          ) : (
            <li>Chưa có chi tiết nào</li>
          )}
        </ul>

        <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={() => navigate('/schedule')}>
          Cập nhật
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/schedule')}>
          Hủy
        </Button>
        <Button variant="outlined" color="error" onClick={handleDeleteSchedule}>
          Xoá lịch trình
        </Button>
      </form>
    </Box>
  );
};

export default EditSchedule;
