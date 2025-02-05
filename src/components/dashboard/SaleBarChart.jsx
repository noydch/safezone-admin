import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, Button } from "antd";
import "../../../chartConfig"; // นำเข้า Chart.js config

const SaleBarChart = () => {
    // ข้อมูลของกราฟ
    const data = {
        labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
        datasets: [
            {
                label: "Sale",
                data: [800000, 300000, 950000, 1200000, 5500000, 400000, 700000],
                backgroundColor: ["#FCA5A5", "#FCA5A5", "#FCA5A5", "#FCA5A5", "#EF4444", "#FCA5A5", "#FCA5A5"],
                borderRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => tooltipItem.raw.toLocaleString(),
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value) => value.toLocaleString(),
                },
            },
        },
    };

    return (
        <div className="h-72">
            <Bar data={data} options={options} />
        </div>
    );
};

export default SaleBarChart;
