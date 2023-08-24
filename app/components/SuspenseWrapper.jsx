import { Await } from "@remix-run/react";
import { Suspense } from "react";

export default function SuspenseWrapper({ dataPromise, children }) {
  return (
    <Suspense fallback={<div className="w-full text-">Loading</div>}>
      <Await
        resolve={dataPromise}
        errorElement={<div className="w-full">Something went wrong!</div>}
      >
        {children}
      </Await>
    </Suspense>
  );
}
