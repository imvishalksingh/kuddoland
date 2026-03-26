export function SectionIntro({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow ? <span className="chip">{eyebrow}</span> : null}
      <h2 className="font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">{title}</h2>
      {description ? <p className="text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}
