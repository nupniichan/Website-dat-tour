import React, { useState } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const AddSchedule = () => {
  const [schedule, setSchedule] = useState({ name: '', startDate: '', endDate: '' });
  const [details, setDetails] = useState([]);
  const [eventDate, setEventDate] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [descriptionContent, setDescriptionContent] = useState(''); // Thêm trạng thái này
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    if (name === 'eventDate') setEventDate(value);
    if (name === 'eventContent') setEventContent(value);
    if (name === 'eventTime') setEventTime(value);
    if (name === 'descriptionContent') setDescriptionContent(value); // Thêm dòng này
  };

  const validateDetail = () => {
    let tempErrors = {};

    // Kiểm tra ngày
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

    // Kiểm tra nội dung sự kiện
    if (!eventContent.trim()) {
      tempErrors.eventContent = "Sự kiện không được để trống";
    }

    // Kiểm tra thời gian
    if (!eventTime) {
      tempErrors.eventTime = "Thời gian không được để trống";
    }

    // Reset errors trước khi set errors mới
    setErrors({});
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddDetail = () => {
    if (validateDetail()) {
      const newDetail = {
        date: eventDate,
        content: eventContent,
        description: descriptionContent,
        time: eventTime
      };

      // Thêm chi tiết mới và sắp xếp lại theo thời gian
      setDetails(prev => {
        const updatedDetails = [...prev, newDetail].sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });
        return updatedDetails;
      });

      // Reset form và errors
      setEventDate('');
      setEventContent('');
      setEventTime('');
      setDescriptionContent('');
      setErrors({}); // Reset errors sau khi thêm thành công
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const data = {
      ...schedule,
      details,
    };
    
    fetch('http://localhost:5000/add-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Schedule added:', data);
        navigate('/'); 
      })
      .catch(err => console.error('Error adding schedule:', err));
  };

  const formatDisplayDate = (dateString) => {
    // Tách ngày tháng năm từ chuỗi YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    // Return định dạng dd/MM/yyyy
    return `${day}/${month}/${year}`;
  };

  return (
    <Box padding={3}>
      <h3>Thêm lịch trình mới</h3>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên lịch trình"
          fullWidth
          name="name"
          value={schedule.name}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Ngày đi"
          type="date"
          fullWidth
          name="startDate"
          value={schedule.startDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.startDate}
          helperText={errors.startDate}
        />
        <TextField
          label="Ngày về"
          type="date"
          fullWidth
          name="endDate"
          value={schedule.endDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.endDate}
          helperText={errors.endDate}
        />

        <h4>Chi tiết lịch trình</h4>
        <Box sx={{ mb: 2 }}>
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
            InputLabelProps={{ shrink: true }}
            error={!!errors.eventTime}
            helperText={errors.eventTime}
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
        </Box>

        <Box mt={2}>
          <h5>Danh sách chi tiết lịch trình:</h5>
          {details.length === 0 ? (
            <p>Chưa có chi tiết nào được thêm</p>
          ) : (
            <ul>
              {details.map((detail, index) => (
                <li key={index}>
                  {`Ngày ${formatDisplayDate(detail.date)} - ${detail.time}: ${detail.content}`}
                  {detail.description && ` - Mô tả: ${detail.description}`}
                </li>
              ))}
            </ul>
          )}
        </Box>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
            Lưu
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>
            Hủy
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddSchedule;
