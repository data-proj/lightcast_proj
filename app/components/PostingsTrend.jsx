import SectionTitle from "./SectionTitle";
import TimeSeriesChart from "./TimeSeriesChart";

export default function PostingsTrendTest({ data }) {
  return (
    <div className="mt-14">
      <SectionTitle title={"Unique Postings Trends"} />
      <TimeSeriesChart data={data} />
    </div>
  );
}
