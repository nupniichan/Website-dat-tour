import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { DatePicker } from "antd";
import moment from "moment";
import { Card, Row, Col, Statistic } from "antd";

const { RangePicker } = DatePicker;

const IncomeManagement = () => {
    const [incomeData, setIncomeData] = useState([]);
    const [tourData, setTourData] = useState([]);
    const [dateRange, setDateRange] = useState([
        moment().subtract(30, "days"),
        moment(),
    ]);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        try {
            const formattedStartDate = dateRange[0].format("YYYY-MM-DD");
            const formattedEndDate = dateRange[1].format("YYYY-MM-DD");

            console.log(
                "Fetching data for:",
                formattedStartDate,
                "to",
                formattedEndDate
            );

            const [incomeRes, tourRes] = await Promise.all([
                axios.get("http://localhost:5000/api/income", {
                    params: {
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                    },
                }),
                axios.get("http://localhost:5000/api/income/by-tour", {
                    params: {
                        startDate: formattedStartDate,
                        endDate: formattedEndDate,
                    },
                }),
            ]);

            console.log("Income Response:", incomeRes.data);
            console.log("Tour Response:", tourRes.data);

            setIncomeData(Array.isArray(incomeRes.data) ? incomeRes.data : []);
            setTourData(Array.isArray(tourRes.data) ? tourRes.data : []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setIncomeData([]);
            setTourData([]);
        }
    };

    const calculateTotalIncome = () => {
        return incomeData.reduce(
            (sum, item) => sum + (Number(item.totalIncome) || 0),
            0
        );
    };

    const calculateTotalOrders = () => {
        return incomeData.reduce(
            (sum, item) => sum + (Number(item.totalOrders) || 0),
            0
        );
    };

    // Hàm format số tiền sang định dạng VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Hàm format ngày sang định dạng Việt Nam
    const formatDate = (date) => {
        return moment(date).format("DD/MM/YYYY");
    };

    // Hàm cắt ngắn text nếu quá dài
    const truncateText = (text, maxLength = 20) => {
        return text.length > maxLength
            ? `${text.substring(0, maxLength)}...`
            : text;
    };

    // Thêm hàm xử lý dữ liệu tour để lấy top 10
    const processTopTours = (data) => {
        if (!data.length) return [];

        // Sắp xếp theo thu nhập giảm dần
        const sortedData = [...data].sort(
            (a, b) => b.totalIncome - a.totalIncome
        );

        if (sortedData.length <= 10) return sortedData;

        // Lấy top 10 tour
        const top10 = sortedData.slice(0, 10);

        // Tính tổng thu nhập của các tour còn lại
        const otherIncome = sortedData
            .slice(10)
            .reduce((sum, item) => sum + item.totalIncome, 0);

        // Thêm mục "Khác" vào cuối
        return [
            ...top10,
            {
                TENTOUR: "Tour khác",
                totalIncome: otherIncome,
            },
        ];
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Quản lý Thu nhập</h1>

            <div className="mb-6">
                <RangePicker
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates)}
                    className="mb-4"
                    format="DD/MM/YYYY"
                    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                />
            </div>

            <Row gutter={16} className="mb-6">
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Thu Nhập"
                            value={calculateTotalIncome()}
                            formatter={(value) => formatCurrency(value)}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Vé"
                            value={calculateTotalOrders()}
                            suffix="vé"
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Trung Bình/Vé"
                            value={
                                calculateTotalOrders()
                                    ? calculateTotalIncome() /
                                      calculateTotalOrders()
                                    : 0
                            }
                            formatter={(value) => formatCurrency(value)}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} className="mb-6">
                <Col span={24}>
                    <Card title="Biểu đồ Thu nhập theo thời gian">
                        {incomeData.length > 0 ? (
                            <LineChart
                                width={1200}
                                height={400}
                                data={incomeData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 25,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                    angle={0}
                                    textAnchor="middle"
                                    height={60}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    tickFormatter={(value) =>
                                        `${value.toLocaleString("vi-VN")}đ`
                                    }
                                />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    labelFormatter={formatDate}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="totalIncome"
                                    stroke="#8884d8"
                                    name="Tổng thu"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="momoIncome"
                                    stroke="#82ca9d"
                                    name="MoMo"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="cashIncome"
                                    stroke="#ffc658"
                                    name="Tiền mặt"
                                />
                            </LineChart>
                        ) : (
                            <div>Không có dữ liệu</div>
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} className="mb-6">
                <Col span={12}>
                    <Card
                        title="Thu nhập theo Tour"
                        bodyStyle={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {tourData.length > 0 ? (
                            <BarChart
                                width={600}
                                height={400}
                                data={processTopTours(tourData)}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 50,
                                    bottom: 25,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="TENTOUR"
                                    tickFormatter={(value) =>
                                        truncateText(value)
                                    }
                                    angle={0}
                                    textAnchor="middle"
                                    height={60}
                                />
                                <YAxis
                                    tickFormatter={(value) =>
                                        `${value.toLocaleString("vi-VN")}đ`
                                    }
                                />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    labelFormatter={(label) => label}
                                />
                                <Legend />
                                <Bar
                                    dataKey="totalIncome"
                                    fill="#8884d8"
                                    name="Thu nhập"
                                />
                            </BarChart>
                        ) : (
                            <div>Không có dữ liệu</div>
                        )}
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title="Phân bố Thu nhập theo Tour"
                        className="text-center"
                    >
                        {tourData.length > 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <PieChart width={500} height={400}>
                                    <Pie
                                        data={processTopTours(tourData)}
                                        dataKey="totalIncome"
                                        nameKey="TENTOUR"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        fill="#8884d8"
                                        label={(entry) =>
                                            `${truncateText(
                                                entry.TENTOUR
                                            )}: ${formatCurrency(
                                                entry.totalIncome
                                            )}`
                                        }
                                    >
                                        {processTopTours(tourData).map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) =>
                                            formatCurrency(value)
                                        }
                                    />
                                    <Legend />
                                </PieChart>
                            </div>
                        ) : (
                            <div>Không có dữ liệu</div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default IncomeManagement;
