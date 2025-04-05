import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function OrderStatusPieChart({ ordersSummary }) {
  if (!ordersSummary) return <p>No data available</p>;

  const { PendingOrders, PreparingOrders, CompletedOrders, CancelledOrders } = ordersSummary;

  const data = {
    labels: ["Pending", "Preparing", "Completed", "Cancelled"],
    datasets: [
      {
        data: [PendingOrders, PreparingOrders, CompletedOrders, CancelledOrders],
        backgroundColor: ["#FFA500", "#00BFFF", "#32CD32", "#FF6347"],
        hoverBackgroundColor: ["#FF8C00", "#1E90FF", "#2E8B57", "#FF4500"],
        borderWidth: 2, // Keeps the chart clean
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%", // Makes the doughnut more hollow
    plugins: {
      legend: {
        display: false, // Hide default legend and create custom below
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const dataset = tooltipItem.dataset;
            const index = tooltipItem.dataIndex;
            return ` ${dataset.data[index]} orders`;
          },
        },
      },
      datalabels: {
        display: false, // 🚀 Ensure NO numbers appear inside the chart
      },
    },
    elements: {
      arc: {
        borderWidth: 2, // Keeps the chart clean
      },
    },
  };

  return (
    <div className="w-full flex  justify-between items-center gap-8">
      {/* Doughnut Chart */}
      <div className="w-full h-[300px]">
        <Doughnut data={data} options={options} />
      </div>

      {/* Custom Legend with Grid Layout */}
      <div className="w-full h-full flex-center">
        <div className="flex-shrink-0 grid grid-cols-2 gap-4 text-lg font-semibold">
          {data.labels.map((label, index) => (
            <div key={index} className="flex items-center text-xl gap-2">
              <span
                className="w-8 h-4 rounded-md"
                style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
              ></span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
