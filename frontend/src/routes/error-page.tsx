import { useRouteError, isRouteErrorResponse, } from "react-router-dom";
import Page from "../components/page/Page";

export default function ErrorPage() {
  const error = useRouteError() as Error;
  console.error(error);
  if (!isRouteErrorResponse(error)) {
    return null;
  }

  return (
    <Page title="Error">
      <div id="error-page">
        <p>Sorry bramski vi fick ett sånt fel du vet mannen, never lucky shit.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </Page>
  );
}
