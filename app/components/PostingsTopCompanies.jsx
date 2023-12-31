import SectionTitle from "./SectionTitle";
import PostingRankingsTableLayout from "./PostingRankingsTableLayout";

export default function PostingsTopCompanies({ data }) {
  return (
    <div className="mt-14">
      <SectionTitle title="Top Companies Posting" underline={true} />
      <PostingRankingsTableLayout
        data={data}
        type="Company"
      ></PostingRankingsTableLayout>
    </div>
  );
}
