import { createCookie } from "@remix-run/node";

const cookie_name = "bearer-token";
// process.env.NODE_ENV === "development"
//   ? "bearer-token"
//   : "__Host-bearer-token";

export const bearerToken = createCookie(cookie_name, {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  secrets: ["ielcqeo", "9qqtf6z"],
  secure: true,
  maxAge: 3600,
});
