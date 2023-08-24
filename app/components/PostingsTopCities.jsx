import SectionTitle from "./SectionTitle";
import PostingRankingsTableLayout from "./PostingRankingsTableLayout";

export default function PostingsTopCities() {
  return (
    <div className="mt-14">
      <SectionTitle title="Top Companies Posting" underline={true} />
      <PostingRankingsTableLayout type="Company"></PostingRankingsTableLayout>
    </div>
  );
}
