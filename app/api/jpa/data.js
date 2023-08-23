import invariant from "tiny-invariant";

const format_token_auth = (token) =>
  `${token.token_type} ${token.access_token}`;

export function getStatus(token) {
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

export function getTotals(token, when = {}, metrics = {}, title_name) {
  invariant(
    token.scope === "postings:us",
    `Invalid token type: ${token.scope}`
  );

  return fetch("https://emsiservices.com/jpa/totals", {
    method: "Post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: format_token_auth(token),
  });
}
