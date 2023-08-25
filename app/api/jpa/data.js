import moment from "moment";
import invariant from "tiny-invariant";

export async function getTaxonomy(token, facet_name, search) {
  invariant(facet_name === "title", `Invalid facet name: ${facet_name}`);
  invariant(/^[a-zA-Z ]*$/.test(search), "Invalid search characters");

  const query_string = `?q=${encodeURIComponent(search)}`;
  const url = `https://emsiservices.com/jpa/taxonomies/${facet_name}${query_string}`;

  return fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: format_token_auth(token),
    },
  });
}

export async function getStatus(token) {
  invariant(
    token.scope === "postings:us",
    `Invalid token scope ${token.scope}`
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
    `Invalid token scope ${token.scope}`
  );

  if (Object.keys(when).length === 0) {
    when = {
      start: moment().subtract(1, "year").format("YYYY-MM"),
      end: moment().format("YYYY-MM"),
    };
  }

  const body = {
    filter: {
      when,
    },
    metrics: [
      "median_posting_duration",
      "posting_intensity",
      "total_postings",
      "unique_postings",
    ],
  };

  if (title_name.length > 0) {
    body.filter.title_name = title_name;
  }

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
  invariant(
    token.scope === "postings:us",
    `Invalid token scope ${token.scope}`
  );

  if (Object.keys(when).length === 0) {
    when = getDefaultWhen();
  }

  const body = {
    filter: {
      when,
    },
    metrics: ["unique_postings"],
  };

  if (title_name.length > 0) {
    body.filter.title_name = title_name;
  }

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
  invariant(
    token.scope === "postings:us",
    `Invalid token scope ${token.scope}`
  );

  invariant(
    facet_name === "company_name" || facet_name === "city_name",
    `Invalid facet name: ${facet_name}`
  );

  if (Object.keys(when).length === 0) {
    when = {
      start: moment().subtract(1, "year").format("YYYY-MM"),
      end: moment().format("YYYY-MM"),
    };
  }

  const body = {
    filter: {
      when,
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

  if (title_name.length > 0) {
    body.filter.title_name = title_name;
  }

  return fetch(`https://emsiservices.com/jpa/rankings/${facet_name}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: format_token_auth(token),
    },
    body: JSON.stringify(body),
  }).then((data) => data.json());
}

// one month
const getDefaultWhen = () => {
  return {
    start: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  };
};

const format_token_auth = (token) =>
  `${token.token_type} ${token.access_token}`;
