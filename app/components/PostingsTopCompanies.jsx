import { useAsyncValue } from "@remix-run/react";
import SectionTitle from "./SectionTitle";
import GradientTable from "./GradientTable";

const columns = [
  {
    key: "col_1",
    title: "Company",
    row_key: "name",
  },
  {
    key: "col_2",
    title: "Total/Unique",
    row_key: "total_unique",
  },
  {
    key: "col_3",
    title: "Posting Intensity",
    row_key: "posting_intensity",
  },
  {
    key: "col_4",
    title: "Median Posting Duration",
    row_key: "median_posting_duration",
  },
];

export default function PostingsTopCompanies() {
  const { data } = useAsyncValue();
  const gradient_key = "unique_postings";

  const final_rows = data.ranking.buckets.map((row) => ({
    ...row,
    key: row.name + "_" + row.median_posting_duration,
    posting_intensity: Math.round(row.posting_intensity) + " : 1",
    total_unique:
      row.total_postings.toLocaleString("en-US") +
      " / " +
      row.unique_postings.toLocaleString("en-US"),
  }));

  console.log(columns, final_rows);

  return (
    <div className="mt-14">
      <SectionTitle title="Top Companies Posting" underline={true} />
      <GradientTable
        columns={columns}
        rows={final_rows}
        gradient_key={gradient_key}
      ></GradientTable>
    </div>
  );
}
