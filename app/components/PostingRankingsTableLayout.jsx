import { useAsyncValue } from "@remix-run/react";
import RankingsTable from "./RankingsTable";

export default function PostingRankingsTableLayout({ type }) {
  const { data } = useAsyncValue();
  const columns = [
    {
      key: "col_1",
      title: type,
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

  const rows = data.ranking.buckets.map((row) => ({
    ...row,
    key: row.name + "_" + row.median_posting_duration,
    posting_intensity: Math.round(row.posting_intensity) + " : 1",
    total_unique:
      row.total_postings.toLocaleString("en-US") +
      " / " +
      row.unique_postings.toLocaleString("en-US"),
  }));

  return (
    <RankingsTable
      columns={columns}
      rows={rows}
      rankings_key="unique_postings"
    ></RankingsTable>
  );
}
