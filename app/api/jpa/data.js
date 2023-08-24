import moment from "moment";
import invariant from "tiny-invariant";

export async function getStatus(token) {
  invariant(
    token.scope === "postings:us",
    `Invalid token type: ${token.scope}`
  );

  return fetch("https://emsiservices.com/jpa/status", {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: format_token_auth(token),
    },
  });
}

export async function getTotals(token, when = {}, title_name = []) {
  invariant(
    token.scope === "postings:us",
    `Invalid token type: ${token.scope}`
  );

  // default to a year
  if (Object.keys(when).length === 0) {
    when = {
      start: moment().subtract(1, "month").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    };
  }

  const body = {
    filter: {
      when,
      //TODO REMOVE
      state_name: ["Idaho"],
      title_name: ["Software Developers"],
    },
    metrics: [
      "median_posting_duration",
      "posting_intensity",
      "total_postings",
      "unique_postings",
    ],
  };

  return fetch("https://emsiservices.com/jpa/totals", {
    method: "Post",
    headers: {
      "content-type": "application/json",
      Authorization: format_token_auth(token),
    },
    body: JSON.stringify(body),
  }).then((data) => data.json());
}

export function getTimeseries(token, when = {}, title_name = []) {
  console.log(moment().format("YYYY-MM-DD"));

  if (Object.keys(when).length === 0) {
    when = {
      start: moment().subtract(1, "months").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    };
  }

  const body = {
    filter: {
      when,
      state_name: ["Idaho"],
      title_name: ["Software Developers"],
    },
    metrics: ["unique_postings"],
  };
  return fetch("https://emsiservices.com/jpa/timeseries", {
    method: "Post",
    headers: {
      "content-type": "application/json",
      Authorization: format_token_auth(token),
    },
    body: JSON.stringify(body),
  }).then((data) => data.json());
}

const format_token_auth = (token) =>
  `${token.token_type} ${token.access_token}`;
