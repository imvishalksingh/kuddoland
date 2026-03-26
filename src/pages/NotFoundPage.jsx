import { Link } from "react-router-dom";
import { Seo } from "../components/ui/Seo";

export function NotFoundPage() {
  return (
    <main className="page-shell flex min-h-[70vh] items-center justify-center py-20">
      <Seo title="404 | Kuddosland" description="Page not found." />
      <div className="panel max-w-xl space-y-5 p-8 text-center">
        <p className="chip mx-auto">404</p>
        <h1 className="font-display text-4xl font-extrabold text-brand-ink">This page wandered off to the toy shelf.</h1>
        <p className="text-slate-600">The route exists in the new application shell, but this particular URL does not.</p>
        <Link to="/" className="inline-flex rounded-full bg-brand-coral px-5 py-3 text-sm font-bold text-white">
          Back to home
        </Link>
      </div>
    </main>
  );
}
