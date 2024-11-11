import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Button, ButtonGroup } from '@mui/material';
import './Dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, TrendingDown, Users, Package, DollarSign, Clock } from 'lucide-react';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, change, icon: Icon, changeType }) => (
  <Card style={{ flex: 1, margin: '0 8px' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="body2" color={changeType === 'up' ? 'success.main' : 'error.main'}>
            {changeType === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {change}
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: 'action.hover', borderRadius: '50%', p: 1 }}>
          <Icon size={24} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Thêm hàm format tiền VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    userChangePercent: 0,
    totalBookings: 0,
    bookingChangePercent: 0,
    totalRevenue: 0,
    revenueChangePercent: 0,
    paidBookings: 0,
    paidBookingChangePercent: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const chartRef = useRef(null);
  const [yearlyComparison, setYearlyComparison] = useState({
    currentYear: 0,
    previousYear: 0,
    percentageChange: 0
  });

  useEffect(() => {
    // Fetch dashboard stats
    axios.get('http://localhost:5000/api/dashboard/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));

    // Fetch monthly revenue data
    axios.get('http://localhost:5000/api/dashboard/monthly-revenue')
      .then(response => {
        const monthlyRevenue = response.data.map(item => ({
          month: item.month,
          revenue: item.revenue
        }));
        setMonthlyData(monthlyRevenue);
      })
      .catch(error => console.error('Error fetching monthly revenue:', error));

    // Fetch recent bookings
    axios.get('http://localhost:5000/api/dashboard/recent-bookings')
      .then(response => setRecentBookings(response.data))
      .catch(error => console.error('Error fetching recent bookings:', error));

    // Fetch yearly comparison data
    axios.get('http://localhost:5000/api/dashboard/yearly-comparison')
      .then(response => {
        const data = response.data;
        const currentYear = new Date().getFullYear();
        const currentYearData = data.find(item => item.year === currentYear)?.revenue || 0;
        const previousYearData = data.find(item => item.year === currentYear - 1)?.revenue || 0;
        
        const percentageChange = previousYearData === 0 ? 0 : 
          ((currentYearData - previousYearData) / previousYearData) * 100;

        setYearlyComparison({
          currentYear: currentYearData,
          previousYear: previousYearData,
          percentageChange: percentageChange
        });
      })
      .catch(error => console.error('Error fetching yearly comparison:', error));
  }, []);

  // Cập nhật data cho chart
  const data = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
             'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [{
      label: 'Doanh số bán vé',
      data: new Array(12).fill(0).map((_, index) => {
        const monthData = monthlyData.find(item => item.month === index + 1);
        return monthData ? monthData.revenue : 0;
      }),
      borderColor: 'rgba(255, 165, 0, 1)',
      backgroundColor: 'rgba(250, 200, 152, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: 'white',
      pointHoverRadius: 8,
      pointHoverBackgroundColor: 'rgba(250, 200, 152, 1)',
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#CCCCFF',
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return formatCurrency(context.raw);
          },
        },
      },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.chartInstance.resize(); // Gọi hàm resize
      }
    };

    window.addEventListener('resize', handleResize); // Lắng nghe sự kiện resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup khi component bị unmount
    };
  }, []);

  // Tính tổng doanh thu từ monthlyData một cách an toàn
  const calculateTotalRevenue = (data) => {
    if (!Array.isArray(data) || data.length === 0) return 0;
    return data.reduce((sum, item) => {
      const revenue = Number(item.revenue) || 0;
      return sum + revenue;
    }, 0);
  };

  return (
    <>
      <h3>Dashboard</h3>
      <div style={{ padding: '16px' }}>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Tổng người dùng" 
              value={stats.totalUsers?.toLocaleString() || '0'} 
              change="" 
              icon={Users} 
              changeType="up" 
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Tổng vé được đặt" 
              value={stats.totalBookings?.toLocaleString() || '0'} 
              change={`${stats.bookingChangePercent.toFixed(1)}% so với tuần trước`} 
              icon={Package} 
              changeType={stats.bookingChangePercent >= 0 ? 'up' : 'down'} 
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Tổng doanh số bán" 
              value={formatCurrency(stats.totalRevenue || 0)} 
              change={`${stats.revenueChangePercent.toFixed(1)}% so với tuần trước`} 
              icon={DollarSign} 
              changeType={stats.revenueChangePercent >= 0 ? 'up' : 'down'} 
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard 
              title="Vé đã thanh toán" 
              value={stats.paidBookings?.toLocaleString() || '0'} 
              change={`${stats.paidBookingChangePercent.toFixed(1)}% so với ngày hôm qua`} 
              icon={Clock} 
              changeType={stats.paidBookingChangePercent >= 0 ? 'up' : 'down'} 
            />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="16px">
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Doanh số bán vé năm {new Date().getFullYear()}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h4" fontWeight="bold" marginRight="8px">
                  {formatCurrency(calculateTotalRevenue(monthlyData))}
                </Typography>
                {yearlyComparison.percentageChange !== 0 && (
                  <Typography 
                    variant="body1" 
                    color={yearlyComparison.percentageChange > 0 ? 'green' : 'error.main'} 
                    fontWeight="bold"
                  >
                    {yearlyComparison.percentageChange > 0 ? '+' : ''}
                    {yearlyComparison.percentageChange.toFixed(1)}% so với năm trước
                  </Typography>
                )}
              </Box>
            </Box>

            <ButtonGroup variant="outlined">
              <Button style={{ textTransform: 'none', backgroundColor: '#f5f5f5', borderColor: '#FFA500', color: '#FFA500' }}>Ngày</Button>
              <Button style={{ textTransform: 'none', backgroundColor: '#f5f5f5', borderColor: '#FFA500', color: '#FFA500' }}>Tuần</Button>
              <Button style={{ textTransform: 'none', backgroundColor: '#FFA500', color: 'white' }}>Thường niên</Button>
            </ButtonGroup>
          </Box>
          <div className='dashboard-chart' style={{ height: '400px' }}>
            <Line ref={chartRef} data={data} options={options} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Danh sách vé được đặt gần đây</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Mã vé</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tên khách hàng</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Ngày đặt</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Số lượng</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Thành tiền</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.ID}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.ID}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.FULLNAME}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {new Date(booking.NGAYDAT).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.SOVE}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {formatCurrency(booking.TONGTIEN)}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', color: getStatusColor(booking.TINHTRANG) }}>
                      {booking.TINHTRANG}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Đã thanh toán': return 'green';
    case 'Chờ xác nhận': return 'orange';
    case 'Đã hủy': return 'red';
    default: return 'black';
  }
};

export default Dashboard;
