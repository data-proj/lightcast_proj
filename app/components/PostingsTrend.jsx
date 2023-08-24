import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useAsyncValue } from "@remix-run/react";
import moment from "moment";
import SectionTitle from "./SectionTitle";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend);

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
      //hack
      ticks: {
        maxTicksLimit: 12,
      },
      border: {
        display: false,
      },
    },
    y: {
      //probably a hack
      grace: "60%",
      grid: {
        display: false,
      },
      border: {
        color: "black",
      },
      ticks: {
        // I guess?
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

export default function PostingsTrend() {
  const timeSeries = useAsyncValue();

  const labels = timeSeries.currentYear.data.timeseries.day.map((date, idx) => {
    return moment(date).format("MMM DD");
  });

  const data = {
    labels,
    datasets: [
      {
        label: `${timeSeries.currentYear.year} trends`,
        data: timeSeries.currentYear.data.timeseries.unique_postings,
        borderColor: "black",
        borderWidth: 1,
        pointBorderColor: "rgb(255,255,255)",
        pointBorderWidth: 3,
        pointStyle: "circle",
        pointRadius: 5,
        pointBackgroundColor: "black",
      },
      {
        label: `${timeSeries.previousYear.year} trends`,
        data: timeSeries.previousYear.data.timeseries.unique_postings,
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
    <div className="mt-14">
      <SectionTitle title={"Unique Postings Trends"} />
      <div className="mt-6 font-normal tracking-tight">
        This view display the most recent 30 days of job postings activity to
        show near-term trends.
      </div>
      <div className="mx-2 mt-10">
        <Line className="w-4/6" options={options} data={data} />
      </div>
    </div>
  );
}
