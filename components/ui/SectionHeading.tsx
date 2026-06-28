interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({ eyebrow, title, description, centered = false }: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-tiger-orange">{eyebrow}</p>
      <h2 className="text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-4 leading-7 text-zinc-400">{description}</p> : null}
    </div>
  );
}
