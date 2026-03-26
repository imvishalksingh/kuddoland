import { SectionIntro } from "../ui/SectionIntro";

export function DashboardPlaceholder({ eyebrow, title, description, highlights }) {
  return (
    <section className="space-y-8">
      <SectionIntro eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="panel p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">{item.label}</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-brand-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
