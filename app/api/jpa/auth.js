// Using dotenv to expose env variables just for this project
import * as dotenv from "dotenv";
dotenv.config();

export function getBearerToken() {
  const auth_params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: "postings:us",
  });

  return fetch("https://auth.emsicloud.com/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: auth_params,
  });
}
