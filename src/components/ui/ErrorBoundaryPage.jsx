import { Link, useRouteError } from "react-router-dom";
import { Seo } from "./Seo";

export function ErrorBoundaryPage() {
  const error = useRouteError();

  return (
    <main className="page-shell flex min-h-screen items-center justify-center py-24">
      <Seo title="Something went wrong | Kuddosland" description="Application error page" />
      <div className="panel max-w-xl space-y-5 p-8 text-center">
        <p className="chip mx-auto">Application Error</p>
        <h1 className="font-display text-4xl font-extrabold text-brand-ink">We hit a bump in the toy aisle.</h1>
        <p className="text-slate-600">{error?.message || "An unexpected error occurred while loading this page."}</p>
        <Link className="inline-flex rounded-full bg-brand-coral px-5 py-3 text-sm font-bold text-white" to="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
