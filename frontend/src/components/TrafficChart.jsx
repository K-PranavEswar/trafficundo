import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

const palette = ["#22d3ee", "#34d399", "#f59e0b", "#fb7185", "#a78bfa", "#38bdf8", "#f97316", "#14b8a6"];

function TrafficChart({ title, labels = [], values = [], type = "bar" }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: labels.map((_, index) => palette[index % palette.length]),
        borderColor: "#22d3ee",
        borderRadius: type === "bar" ? 12 : 0,
        borderWidth: type === "line" ? 3 : 1,
        tension: 0.35,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === "doughnut",
        labels: {
          color: "#94a3b8",
          boxWidth: 12,
          usePointStyle: true,
        },
      },
    },
    scales:
      type === "doughnut"
        ? {}
        : {
            x: {
              ticks: { color: "#94a3b8" },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: { color: "#94a3b8", precision: 0 },
              grid: { color: "rgba(148, 163, 184, 0.18)" },
            },
          },
  };

  const Chart = type === "doughnut" ? Doughnut : type === "line" ? Line : Bar;

  return (
    <div className="glass-panel h-full p-5">
      <h2 className="text-lg font-black text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-5 h-72">
        <Chart data={data} options={options} />
      </div>
    </div>
  );
}

export default TrafficChart;
