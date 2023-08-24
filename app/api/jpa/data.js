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

  if (Object.keys(when).length === 0) {
    when = getDefaultWhen();
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
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: format_token_auth(token),
    },
    body: JSON.stringify(body),
  }).then((data) => data.json());
}

export async function getTimeseries(token, when = {}, title_name = []) {
  // default one month
  if (Object.keys(when).length === 0) {
    when = getDefaultWhen();
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
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: format_token_auth(token),
    },
    body: JSON.stringify(body),
  }).then((data) => data.json());
}

export async function getRankings(
  token,
  when = {},
  title_name = [],
  facet_name = "company_name"
) {
  if (Object.keys(when).length === 0) {
    when = getDefaultWhen();
  }

  const body = {
    filter: {
      when,
      state_name: ["Idaho"],
      title_name: ["Software Developers"],
      company_name: {
        exclude: ["Unclassified"],
      },
    },
    rank: {
      by: "unique_postings",
      extra_metrics: [
        "total_postings",
        "duplicate_postings",
        "posting_intensity",
        "median_posting_duration",
      ],
    },
  };

  return fetch(`https://emsiservices.com/jpa/rankings/${facet_name}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: format_token_auth(token),
    },
    body: JSON.stringify(body),
  }).then((data) => data.json());
}

const getDefaultWhen = () => {
  return {
    start: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  };
};

const format_token_auth = (token) =>
  `${token.token_type} ${token.access_token}`;
