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

export async function getTotals(
  token,
  title_name = [],
  when = {},
  metrics = []
) {
  invariant(
    token.scope === "postings:us",
    `Invalid token type: ${token.scope}`
  );

  // default to a year
  if (Object.keys(when).length === 0) {
    when = getDefaultWhen();
  }

  const body = {
    filter: {
      when,
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
  });
}

const format_token_auth = (token) =>
  `${token.token_type} ${token.access_token}`;

const getDefaultWhen = () => {
  const today = new Date();
  const prior_year_date = new Date();
  prior_year_date.setYear(today.getFullYear() - 1);

  return {
    start: `${prior_year_date.getFullYear()}-${prior_year_date.toLocaleString(
      "default",
      { month: "2-digit" }
    )}`,
    end: `${today.getFullYear()}-${today.toLocaleString("default", {
      month: "2-digit",
    })}`,
  };
};
