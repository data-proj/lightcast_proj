import { createCookie } from "@remix-run/node";

export const bearerToken = createCookie("bearer-token", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secrets: ["s3cret1"],
  secure: true,
  maxAge: 3600,
});
