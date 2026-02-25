import {
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error occurred.</p>
      {isRouteErrorResponse(error) ? (
        <p className="error-message">
          {error.status} - {error.statusText}
        </p>
      ) : error instanceof Error ? (
        <p className="error-message">{error.message}</p>
      ) : (
        <p className="error-message">Unknown error</p>
      )}
      <a href="/">Go Home</a>
    </div>
  );
}

export default function App() {
  return null;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/app.css" },
];
