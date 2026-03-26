import { useParams } from "react-router-dom";
import { TrackingTimeline } from "../components/shop/TrackingTimeline";
import { Seo } from "../components/ui/Seo";
import { trackingEvents } from "../data/mockData";

export function TrackOrderPage() {
  const { orderId } = useParams();

  return (
    <main className="page-shell py-10">
      <Seo title="Track order | Kuddosland" description="FShip-powered order tracking timeline." />
      <div className="panel max-w-3xl space-y-6 p-8">
        <div>
          <p className="chip">FShip tracking</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-brand-ink">Tracking order {orderId}</h1>
        </div>
        <TrackingTimeline events={trackingEvents} />
      </div>
    </main>
  );
}
