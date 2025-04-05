import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import data labels plugin

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend, ChartDataLabels);

export const BarChartOrderHourly = ({ data }) => {
    // Prepare the dataset for Chart.js
    const chartData = {
        labels: Array.from({ length: 24 }, (_, i) => i.toString()), // Y-axis (0 to 24 hours)
        datasets: [
            {
                label: "Hourly Revenue",
                data: data.reduce((acc, item) => {
                    acc[item.OrderHour] = parseFloat(item.TotalRevenue) || 0; // Convert revenue to number
                    return acc;
                }, new Array(24).fill(0)), // Filling missing hours with 0 revenue
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                barThickness: 25, // Increase thickness
            },
        ],
    };

    // Extract order counts for labels
    const orderCounts = data.reduce((acc, item) => {
        acc[item.OrderHour] = item.TotalOrders; // Use correct key
        return acc;
    }, new Array(24).fill(""));

    // Chart options
    const options = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Revenue ($)",
                    font: { size: 16 },
                },
                ticks: {
                    font: { size: 14 },
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Hour of the Day",
                    font: { size: 16 },
                },
                ticks: {
                    stepSize: 1, // Show every hour
                    font: { size: 14 },
                },
            },
        },
        plugins: {
            tooltip: {
                titleFont: { size: 14 },
                bodyFont: { size: 14 },
                callbacks: {
                    label: (tooltipItem) => {
                        const revenue = Number(tooltipItem.raw); // Ensure it's a number
                        return `Revenue: $${revenue.toFixed(2)}`;
                    },
                },
            },
            legend: { display: false },
            datalabels: {
                anchor: "end",
                align: "end",
                color: "black",
                font: { size: 14, weight: "bold" },
                formatter: (value, context) => {
                    const hour = context.dataIndex;
                    return orderCounts[hour] ? `${orderCounts[hour]} Orders` : "";
                },
            },
        },
    };

    return (
        <div style={{ width: "100%", height: "600px" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};
