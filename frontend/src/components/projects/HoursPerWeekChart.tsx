import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface HoursPerWeekChartProps {
  weeklyData: { week: string; hours: number }[];
}

const HoursPerWeekChart: React.FC<HoursPerWeekChartProps> = ({ weeklyData }) => {
  const chartData = {
    labels: weeklyData.map((data) => data.week),
    datasets: [
      {
        label: 'Hours Worked',
        data: weeklyData.map((data) => data.hours),
        backgroundColor: '#4ade80',
        borderRadius: 4,
        barPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#374151' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#374151' },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: '#f9fafb',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow-md p-4">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default HoursPerWeekChart;
