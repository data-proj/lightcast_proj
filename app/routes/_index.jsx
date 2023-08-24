import { json, defer } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  Await,
  useAsyncValue,
} from "@remix-run/react";
import { bearerToken } from "~/cookies.server";
import { getBearerToken } from "../api/jpa/auth";
import { getStatus, getTimeseries, getTotals } from "../api/jpa/data";

// import { Await } from "@remix-run/react";
import { Suspense } from "react";
import PostingsOverview from "../components/PostingsOverview";
import moment from "moment";
import PostingsTrend from "../components/PostingsTrend";

export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie");
  let cookie = (await bearerToken.parse(cookieHeader)) || {};

  let health_check = {};
  if (Object.keys(cookie).length > 0) {
    const status_response = await getStatus(cookie);
    health_check = await status_response.json();
  }

  if (
    Object.keys(cookie).length === 0 ||
    health_check.message === "Token expired"
  ) {
    console.log("getting a new token at", moment().format("LTS"));
    const token_response = await getBearerToken();
    cookie = await token_response.json();
  }

  const totalsPromise = getTotals(cookie);
  const timeSeriesPromise = getTimeseries(cookie).then(async (currentYear) => {
    return getTimeseries(cookie, {
      start: moment()
        .subtract(1, "years")
        .subtract(1, "months")
        .format("YYYY-MM-DD"),
      end: moment().subtract(1, "years").format("YYYY-MM-DD"),
    }).then((previousYear) => {
      return {
        currentYear: { ...currentYear, year: moment().format("YYYY") },
        previousYear: {
          ...previousYear,
          year: moment().subtract(1, "years").format("YYYY"),
        },
      };
    });
  });

  return defer(
    {
      totalsPromise: totalsPromise,
      timeSeriesPromise,
    },
    {
      headers: {
        "Set-Cookie": await bearerToken.serialize(cookie),
      },
    }
  );
}
export const meta = () => {
  return [
    { title: "Lightcast Project" },
    { name: "description", content: "Here we go" },
  ];
};

export default function Index() {
  const { totalsPromise, timeSeriesPromise } = useLoaderData();

  return (
    <div className="grid grid-cols-[350px_auto]">
      <div>INPUT</div>
      <div className="col-start-2 mb-8 mr-8 mt-8 bg-white p-20col-start-2 mb-8 mr-8 mt-8 bg-white p-20">
        <div className="text-5xl tracking-tight">
          Job Posting Competition: Software Developers
        </div>
        <Suspense fallback={<p>Loading totals...</p>}>
          <Await
            resolve={totalsPromise}
            errorElement={<p>Error loading TOTALS!</p>}
          >
            <PostingsOverview />
          </Await>
        </Suspense>
        <Suspense fallback={<p>Loading time series...</p>}>
          <Await
            resolve={timeSeriesPromise}
            errorElement={<p>Error loading TIME SERIES!</p>}
          >
            <PostingsTrend />
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
