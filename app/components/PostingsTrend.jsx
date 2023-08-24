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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend);

export default function PostingsTrend() {
  const timeSeries = useAsyncValue();
  console.log(timeSeries);

  const labels = timeSeries.currentYear.data.timeseries.day.map((date, idx) => {
    return moment(date).format("MMM DD");
  });

  const data = {
    labels,
    datasets: [
      {
        label: `${timeSeries.currentYear.year} trends`,
        data: timeSeries.currentYear.data.timeseries.unique_postings,
      },
      {
        label: `${timeSeries.currentYear.year} trends`,
        data: timeSeries.previousYear.data.timeseries.unique_postings,
      },
    ],
  };

  return (
    <div className="mt-14">
      <div className="mx-2 mt-10">
        <Line className="w-4/6" data={data} />
      </div>
    </div>
  );
}
