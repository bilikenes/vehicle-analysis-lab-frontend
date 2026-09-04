export function EditorialSideRail() {
  return (
    <aside
      data-testid="editorial-side-rail"
      className="pointer-events-none absolute inset-y-0 left-0 z-30 hidden w-[153px] border-r border-border/75 min-[1440px]:block"
    >
      <div className="absolute left-7 top-[72px] font-mono text-[8px] uppercase leading-5 tracking-[0.18em] text-secondary-text/70">
        <span className="block">Structured</span>
        <span className="block">Extraction</span>
        <span className="mt-4 block h-px w-5 bg-accent/80" />
      </div>

      <div className="absolute left-7 top-[164px] grid grid-cols-3 gap-[5px] opacity-55">
        {Array.from({ length: 9 }, (_, index) => (
          <span className="size-px bg-secondary-text" key={index} />
        ))}
      </div>

      <div className="absolute bottom-[132px] left-7 font-mono text-[8px] uppercase leading-5 tracking-[0.18em] text-secondary-text/58">
        <span className="block">Prototype</span>
        <span className="block">Results</span>
        <span className="mt-2 block tracking-[0.12em]">Ref: 1672-941</span>
      </div>

      <div className="absolute bottom-7 left-6 grid size-8 place-items-center rounded-full border border-border text-xs text-primary-text/80">
        N
      </div>
    </aside>
  );
}
