import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      align: "start",
      labels: {
        usePointStyle: true,
        showLine: true,
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        lineWidth: 1.9,
      },
      ticks: {
        maxTicksLimit: 12,
      },
      border: {
        display: false,
      },
    },
    y: {
      grace: "60%",
      grid: {
        display: false,
      },
      border: {
        color: "black",
      },
      ticks: {
        callback: (value) =>
          Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(value),
        border: {
          color: "black",
        },
      },
    },
  },
};

export default function TimeSeriesChart({ data }) {
  const labels = data.currentYear.data.timeseries.day.map((date, idx) => {
    return moment(date).format("MMM DD");
  });

  const chart_data = {
    labels,
    datasets: [
      {
        label: `${data.currentYear.year} trends`,
        data: data.currentYear.data.timeseries.unique_postings,
        borderColor: "black",
        borderWidth: 1,
        pointBorderColor: "rgb(255,255,255)",
        pointBorderWidth: 3,
        pointStyle: "circle",
        pointRadius: 5,
        pointBackgroundColor: "black",
      },
      {
        label: `${data.previousYear.year} trends`,
        data: data.previousYear.data.timeseries.unique_postings,
        borderColor: "rgba(53, 162, 235, 0.5)",
        borderWidth: 2,
        pointBorderColor: "rgb(255,255,255)",
        pointBorderWidth: 2,
        order: 1,
        pointStyle: "rect",
        pointRadius: 7,
        pointBackgroundColor: "rgba(53, 162, 235)",
      },
    ],
  };
  return (
    <>
      <div className="mt-6 font-normal tracking-tight">
        This view displays the most recent 30 days of job postings activity to
        show near-term trends.
      </div>
      <div className="mx-2 mt-10">
        <Line className="w-4/6" options={options} data={chart_data} />
      </div>
    </>
  );
}
