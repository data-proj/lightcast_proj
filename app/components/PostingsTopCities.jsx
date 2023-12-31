import SectionTitle from "./SectionTitle";
import PostingRankingsTableLayout from "./PostingRankingsTableLayout";

export default function PostingsTopCities({ data }) {
  return (
    <div className="mt-14">
      <SectionTitle title="Top Cities Posting" underline={true} />

      <PostingRankingsTableLayout
        data={data}
        type="City"
      ></PostingRankingsTableLayout>
    </div>
  );
}
