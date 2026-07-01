export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-line pt-10 first:mt-0 first:border-t-0 first:pt-0">
      <h2 className="text-eyebrow mb-4">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">
        {children}
      </div>
    </section>
  );
}
