import { useAsyncValue } from "@remix-run/react";

export default function PostingsOverview() {
  const { data } = useAsyncValue();

  const total_postings = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(data.totals.total_postings);
  const unique_postings = data.totals.unique_postings.toLocaleString("en-US");
  const posting_intensity = Math.round(data.totals.posting_intensity);
  const median_posting_duration = data.totals.median_posting_duration;

  return (
    <div className="mt-14">
      {" "}
      <div className="pb-2 text-xl font-semibold tracking-tight">
        Job Postings Overview
      </div>
      <div className="grid grid-cols-3 text-center">
        <div className="border-y py-12">
          <span className="text-5xl font-light ">{unique_postings}</span>
          <span className="mt-1 block font-semibold">Unique Postings</span>
        </div>
        <div className="border p-12">
          <span className="text-5xl font-light ">{`${posting_intensity}\u00A0\u00A0:\u00A0\u00A01`}</span>
          <span className="mt-1 block font-semibold">Posting Intensity</span>
        </div>
        <div className="border-y py-12">
          <span className="text-5xl font-light ">
            {`${median_posting_duration} days`}
          </span>
          <span className="mt-1 block font-semibold">
            Median Posting Duration
          </span>
        </div>
      </div>
      <div className="mt-8 text-gray-500">
        There were{" "}
        <span className="font-semibold text-gray-800">{total_postings}</span>{" "}
        total job postings for your selection, of which{" "}
        <span className="font-semibold text-gray-800">{unique_postings}</span>{" "}
        were unique. These numbers give us a Posting Intensity of{" "}
        <span className="font-semibold text-gray-800">
          {posting_intensity}-to-1
        </span>
        , meaning that for every {posting_intensity} postings there is 1 unique
        job posting.
      </div>
    </div>
  );
}
