import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { bearerToken } from "~/cookies.server";
import { getBearerToken } from "../api/jpa/auth";
import { getStatus } from "../api/jpa/data";

export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie");
  let cookie = (await bearerToken.parse(cookieHeader)) || {};

  let health_check = {};
  if (Object.keys(cookie).length > 0) {
    // const status_response = await getStatus(cookie);
    // health_check = await status_response.json();
  }

  if (
    Object.keys(cookie).length === 0 ||
    health_check.message === "Token expired"
  ) {
    const token_response = await getBearerToken();
    cookie = await token_response.json();
  }

  return json(
    { status: "status check off" },
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
  const data = useLoaderData();

  console.log(data);

  return (
    <div className="grid grid-cols-3">
      <div>A</div>
      <div>B</div>
      <div>C</div>
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
