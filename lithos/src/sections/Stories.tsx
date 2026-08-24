import { Play, Quote } from "lucide-react";
import { storiesGrid } from "../lib/content";
import { Reveal, Section } from "../lib/ui";

export default function Stories() {
  const { hero, wide } = storiesGrid;

  return (
    <Section>
      <Reveal className="mb-12">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-center lg:gap-14">
          <h2 className="text-[34px] leading-[1.14] tracking-tight md:text-[42px]">
            <span className="block text-muted-foreground">
              {storiesGrid.lead}
            </span>
            <span className="block">TestMu AI (formerly LambdaTest)</span>
          </h2>
          <p className="max-w-[430px] text-[16px] leading-relaxed text-muted-foreground">
            {storiesGrid.body}
          </p>
        </div>
        <button className="mt-8 rounded-[10px] border border-border bg-surface px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary">
          {storiesGrid.cta}
        </button>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="overflow-hidden  border border-border-muted bg-surface">
          {/* headline case */}
          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            <div className="p-8 pr-0 lg:border-r lg:border-border-muted">
              <div
                data-cursor="Play video"
                className="group relative h-[300px] overflow-hidden md:h-[420px]"
              >
                <img
                  src={hero.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(211deg, rgba(18,18,18,0) 26%, rgba(18,18,18,0.63) 78%)",
                  }}
                />

                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-6">
                  <div>
                    <p className="pixel text-[44px] leading-none tracking-tight text-white md:text-[56px]">
                      {hero.stat}
                    </p>
                    <p className="mt-2 text-[15px] capitalize text-white/90">
                      {hero.statLabel}
                    </p>
                  </div>
                  <button className="flex shrink-0 items-center gap-2 rounded-[6px] border border-white bg-white/10 px-4 py-2 text-[13px] font-medium uppercase text-white backdrop-blur-md transition-colors hover:bg-white/20">
                    <Play size={13} className="fill-white" />
                    {hero.action}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-8 p-8">
              <img
                src={hero.brand}
                alt="Dashlane"
                className="h-9 w-auto max-w-[147px] object-contain object-left"
              />
              <div>
                <Quote size={22} className="text-foreground" />
                <blockquote className="mt-5 max-w-[380px] text-[22px] leading-[1.35] tracking-tight md:text-[24px]">
                  {hero.quote}
                </blockquote>
                <footer className="mt-6 text-[15px]">
                  {hero.name}
                  <span className="block text-[14px] text-muted-foreground">
                    {hero.role}
                  </span>
                </footer>
              </div>
            </div>
          </div>

          {/* supporting cases */}
          <div className="grid border-t border-border-muted lg:grid-cols-[1fr_1fr_1.6fr]">
            {storiesGrid.cells.map((cell) => (
              <div
                key={cell.brand}
                data-cursor="Case study"
                className="flex flex-col justify-between gap-12 border-b border-border-muted p-6 transition-colors duration-500 hover:bg-secondary/40 lg:border-b-0 lg:border-r lg:border-border-muted"
              >
                <img
                  src={cell.brand}
                  alt=""
                  className="h-8 w-auto max-w-[170px] object-contain object-left"
                />
                <div>
                  <p className="pixel text-[40px] leading-none tracking-tight">
                    {cell.stat}
                  </p>
                  <p className="mt-3 max-w-[240px] text-[15px] leading-relaxed text-muted-foreground">
                    {cell.desc}
                  </p>
                </div>
              </div>
            ))}

            <div
              data-cursor="Read case study"
              className="group relative min-h-[320px] overflow-hidden"
            >
              <img
                src={wide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(54deg, rgba(18,18,18,0.78) 32%, rgba(18,18,18,0) 72%)",
                }}
              />
              <div className="relative flex h-full flex-col justify-between p-8">
                <img
                  src={wide.brand}
                  alt="Best Egg"
                  className="h-9 w-auto max-w-[157px] object-contain object-left"
                />
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="pixel text-[44px] leading-none tracking-tight text-white">
                      {wide.stat}
                    </p>
                    <p className="mt-3 max-w-[260px] text-[15px] capitalize leading-snug text-white/90">
                      {wide.desc}
                    </p>
                  </div>
                  <button className="flex shrink-0 items-center gap-2 rounded-[6px] border border-white bg-white/10 px-4 py-2 text-[13px] font-medium uppercase text-white backdrop-blur-md transition-colors hover:bg-white/20">
                    {wide.action}
                    <Play size={12} className="fill-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
