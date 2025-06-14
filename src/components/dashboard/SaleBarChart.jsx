import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Select, DatePicker } from "antd";
import "../../../chartConfig"; // นำเข้า Chart.js config

const { RangePicker } = DatePicker;

const SaleBarChart = ({ orders }) => {
    const [selectedRange, setSelectedRange] = useState('ລາຍວັນ');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [dateRange, setDateRange] = useState(null);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: "ຍອດຂາຍ",
            data: [],
            backgroundColor: [],
            borderRadius: 5,
        }]
    });

    // Function to format date to YYYY-MM-DD
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Function to format date to DD/MM
    const formatDayLabel = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    };

    // Function to get dates between start and end date
    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(formatDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    // Function to get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Function to calculate sales for each date
    const calculateSalesByDate = (orders, dates) => {
        return dates.map(date => {
            const dayOrders = orders.filter(order =>
                formatDate(new Date(order.updatedAt)) === date
            );
            return dayOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
        });
    };

    useEffect(() => {
        if (!orders) return;

        let dates = [];
        let sales = [];
        let labels = [];

        if (selectedRange === 'ລາຍວັນ') {
            // Last 7 days
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 6);
            dates = getDatesInRange(startDate, endDate);
            sales = calculateSalesByDate(orders, dates);
            labels = dates.map(date => formatDayLabel(date));
        } else if (selectedRange === 'ລາຍເດືອນ') {
            // Selected month
            const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
            dates = Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(selectedYear, selectedMonth, i + 1);
                return formatDate(date);
            });
            sales = calculateSalesByDate(orders, dates);
            labels = dates.map(date => formatDayLabel(date));
        } else if (selectedRange === 'ລາຍປີ') {
            // Selected year
            const months = [
                'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ',
                'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'
            ];
            labels = months;
            sales = months.map((_, monthIndex) => {
                const monthOrders = orders.filter(order => {
                    const orderDate = new Date(order.updatedAt);
                    return orderDate.getFullYear() === selectedYear &&
                        orderDate.getMonth() === monthIndex;
                });
                return monthOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
            });
        } else if (dateRange) {
            // Custom date range
            dates = getDatesInRange(dateRange[0], dateRange[1]);
            sales = calculateSalesByDate(orders, dates);
            labels = dates.map(date => formatDayLabel(date));
        }

        // Generate background colors - using green tones
        const backgroundColors = sales.map((_, index) =>
            index === sales.length - 1 ? '#22C55E' : '#86EFAC'  // Dark green for latest, light green for others
        );

        setChartData({
            labels: labels,
            datasets: [{
                label: "ຍອດຂາຍ",
                data: sales,
                backgroundColor: backgroundColors,
                borderRadius: 5,
            }]
        });
    }, [orders, selectedRange, selectedMonth, selectedYear, dateRange]);

    const handleRangeChange = (value) => {
        setSelectedRange(value);
        setDateRange(null);
    };

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
    };

    const handleYearChange = (value) => {
        setSelectedYear(value);
    };

    const handleDateRangeChange = (dates) => {
        if (dates) {
            setDateRange(dates);
            setSelectedRange('custom');
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => tooltipItem.raw.toLocaleString() + ' ກີບ',
                },
            },
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => value.toLocaleString() + ' ກີບ',
                },
                grid: {
                    color: '#E5E7EB'  // Light gray grid lines
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
    };

    const monthOptions = [
        { value: 0, label: 'ມັງກອນ' },
        { value: 1, label: 'ກຸມພາ' },
        { value: 2, label: 'ມີນາ' },
        { value: 3, label: 'ເມສາ' },
        { value: 4, label: 'ພຶດສະພາ' },
        { value: 5, label: 'ມິຖຸນາ' },
        { value: 6, label: 'ກໍລະກົດ' },
        { value: 7, label: 'ສິງຫາ' },
        { value: 8, label: 'ກັນຍາ' },
        { value: 9, label: 'ຕຸລາ' },
        { value: 10, label: 'ພະຈິກ' },
        { value: 11, label: 'ທັນວາ' },
    ];

    const yearOptions = Array.from({ length: 7 }, (_, i) => ({
        value: 2023 + i,
        label: (2023 + i).toString()
    }));

    return (
        <div className="h-74">
            <div className="flex justify-end mb-4 gap-2">
                <Select
                    value={selectedRange}
                    style={{ width: 120 }}
                    onChange={handleRangeChange}
                    options={[
                        { value: 'ລາຍວັນ', label: 'ລາຍວັນ' },
                        { value: 'ລາຍເດືອນ', label: 'ລາຍເດືອນ' },
                        { value: 'ລາຍປີ', label: 'ລາຍປີ' },
                    ]}
                />
                {selectedRange === 'ລາຍເດືອນ' && (
                    <>
                        <Select
                            value={selectedMonth}
                            style={{ width: 120 }}
                            onChange={handleMonthChange}
                            options={monthOptions}
                        />
                        <Select
                            value={selectedYear}
                            style={{ width: 120 }}
                            onChange={handleYearChange}
                            options={yearOptions}
                        />
                    </>
                )}
                {selectedRange === 'ລາຍປີ' && (
                    <Select
                        value={selectedYear}
                        style={{ width: 120 }}
                        onChange={handleYearChange}
                        options={yearOptions}
                    />
                )}
                {selectedRange === 'ລາຍວັນ' && (
                    <RangePicker onChange={handleDateRangeChange} />
                )}
            </div>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default SaleBarChart;
