import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { formatDate } from '../../utils/formatDate';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

interface ProjectProgressChartProps {
  progressData: { date: string; hours: number }[];
}

const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ progressData }) => {
  // Sort the progressData by date (oldest to newest)
  const sortedData = [...progressData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Add 7 days to the most recent date
  const extendedData = [...sortedData];
  if (sortedData.length > 0) {
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + i);
      extendedData.push({ date: nextDate.toISOString().split('T')[0], hours: 0 });
    }
  }

  const chartData = {
    labels: extendedData.map((data) => formatDate(data.date)),
    datasets: [
      {
        label: 'Hours Worked',
        data: extendedData.map((data) => data.hours),
        borderColor: '#2563eb', // Blue color
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        fill: true,
        tension: 0.3, // Smooth curve
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
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProjectProgressChart;
