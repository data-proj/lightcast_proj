import { defer, json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useFetcher,
  useRouteError,
} from "@remix-run/react";
import { bearerToken } from "~/cookies.server";
import { getBearerToken } from "../api/jpa/auth";

import {
  getRankings,
  getStatus,
  getTaxonomy,
  getTimeseries,
  getTotals,
} from "../api/jpa/data";
import moment from "moment";

import PostingsOverview from "../components/PostingsOverview";
import PostingsTrend from "../components/PostingsTrend";
import PostingsTopCities from "../components/PostingsTopCities";
import PostingsTopCompanies from "../components/PostingsTopCompanies";
import { validateSearch } from "../helpers/validate_search";

export async function loader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("name");

  if (!search) {
    return { errors: { emptySearch: "Please enter a Job Title" } };
  }

  if (validateSearch(search)) {
    return { errors: { invalidSearch: "Invalid Search" } };
  }

  const cookieHeader = request.headers.get("Cookie");
  let token = (await bearerToken.parse(cookieHeader)) || {};

  let health_check = {};
  if (Object.keys(token).length > 0) {
    const status_response = await getStatus(token);
    health_check = await status_response.json();
  }

  if (
    Object.keys(token).length === 0 ||
    health_check.message === "Token expired"
  ) {
    const token_response = await getBearerToken();
    token = await token_response.json();
  }

  const response = search ? await getTaxonomy(token, "title", search) : null;
  const results = response ? await response.json() : null;

  if (results.data.length === 0) {
    return { errors: { noData: "No Results" } };
  }

  const first_result = [results.data.pop().name];

  const totalPostings = await getTotals(token, {}, first_result);
  // year over year time series
  const timeSeriesPostings = await getTimeseries(token, {}, first_result).then(
    async (currentYear) => {
      return getTimeseries(
        token,
        {
          start: moment()
            .subtract(1, "years")
            .subtract(1, "months")
            .format("YYYY-MM-DD"),
          end: moment().subtract(1, "years").format("YYYY-MM-DD"),
        },
        first_result
      ).then((previousYear) => {
        return {
          data: {
            currentYear: {
              ...currentYear,
              year: moment().format("YYYY"),
            },
            previousYear: {
              ...previousYear,
              year: moment().subtract(1, "years").format("YYYY"),
            },
          },
        };
      });
    }
  );
  const companyRankingsPostings = await getRankings(token, {}, first_result);
  const cityRankingsPostings = await getRankings(
    token,
    {},
    first_result,
    "city_name"
  );

  return json(
    {
      totalPostings,
      timeSeriesPostings,
      companyRankingsPostings,
      cityRankingsPostings,
      first_result: first_result[0],
    },
    {
      headers: {
        "Set-Cookie": await bearerToken.serialize(token),
      },
    }
  );
}

export const meta = () => {
  return [{ title: "Lightcast Project" }];
};

export default function Index() {
  const fetcher = useFetcher();
  console.log(fetcher);
  return (
    <div className="grid grid-cols-[350px_1fr] ">
      <div className="mt-8 col-start-1 ml-8 mr-8">
        <div className="bg-white mx-h-30 p-5 rounded-sm ">
          <fetcher.Form method="get">
            <div className="font-semibold mt-2 text-lg">
              <label>Job Title </label>
            </div>
            <input
              className="mt-8 p-3 outline-0 border-2 rounded w-full"
              type="text"
              name="name"
            />
            {fetcher.state === "idle" && fetcher.data?.errors?.invalidSearch ? (
              <p className="text-red-400 text-xs">
                {fetcher.data.errors?.invalidSearch}
              </p>
            ) : null}
            <div className="mt-10 bg-[#00ad8f] rounded text-center py-3">
              {" "}
              <button
                className="text-lg font-bold text-white"
                type="submit"
                name="intent"
                value="update"
              >
                Search
              </button>
            </div>
          </fetcher.Form>
        </div>
      </div>

      <div className="col-start-2 mb-8 mr-8 mt-8 bg-white p-20 rounded-sm">
        {fetcher.state === "loading" ? (
          <div>
            <div className="text-5xl tracking-tight">
              Job Posting Competition
            </div>
            <div className="py-8 w-full text-center text-xl"> loading</div>
          </div>
        ) : null}
        {fetcher.state === "idle" && fetcher.data && !fetcher.data?.errors ? (
          <div>
            <div className="text-5xl tracking-tight">
              {`Job Posting Competition: ${fetcher.data.first_result}`}
            </div>
            <PostingsOverview data={fetcher.data.totalPostings.data} />
            <PostingsTrend data={fetcher.data.timeSeriesPostings.data} />
            <PostingsTopCompanies
              data={fetcher.data.companyRankingsPostings.data}
            />
            <PostingsTopCities data={fetcher.data.cityRankingsPostings.data} />
          </div>
        ) : null}
        {fetcher.state === "idle" &&
        (!fetcher.data ||
          fetcher?.data?.errors?.noData ||
          fetcher?.data?.errors?.emptySearch) ? (
          <div className="py-8 w-full text-center text-xl">
            Please enter a Job Title
          </div>
        ) : null}{" "}
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
