import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DayOfWeekChart({ data }) {
  const maxCount = Math.max(...data.map(d => d.count));
  
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Posts',
        data: data.map(d => d.count),
        backgroundColor: data.map(d => 
          d.count === maxCount 
            ? 'rgba(16, 185, 129, 0.8)' 
            : 'rgba(139, 92, 246, 0.8)'
        ),
        borderColor: data.map(d => 
          d.count === maxCount 
            ? 'rgba(16, 185, 129, 1)' 
            : 'rgba(139, 92, 246, 1)'
        ),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Posts by Day of Week',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const dataPoint = data[context.dataIndex];
            return [
              `Posts: ${dataPoint.count}`,
              `Percentage: ${dataPoint.percentage}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          stepSize: Math.ceil(maxCount / 5),
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default DayOfWeekChart;
