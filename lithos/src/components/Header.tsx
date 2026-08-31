import { useEffect, useRef, useState } from "react";
import {
  NAV,
  announcement,
  headerActions,
  type Card,
  type DescItem,
  type GridMenu,
  type Group,
  type PanelMenu,
  type ProductsMenu,
  type RailBlock,
  type RichItem,
} from "../lib/nav";

/* Global header. Five nav items, four panels, one config.
   Panels are absolutely positioned under the bar, so opening one never
   shifts the page. Every panel is exactly as wide as its own contents. */

const ROW_PLAIN =
  "flex items-center min-h-[34px] px-[9px] -mx-[9px] text-[15px] font-medium text-[#121212] whitespace-nowrap overflow-hidden text-ellipsis transition-colors hover:bg-[#F5F4F0]";
const CAPTION = "text-[15px] font-normal text-[#7F7F7E]";
/* the artifact pattern: small tracked caps over each column */
const CAPTION_MONO =
  "font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[#7F7F7E]";
const CLOSE_DELAY = 120;

function RichRow({ item }: { item: RichItem }) {
  return (
    <a
      href="#top"
      className="flex items-start gap-[11px] px-[9px] py-[7px] -mx-[9px] transition-colors hover:bg-[#F5F4F0]"
    >
      <img
        src={item.icon}
        alt=""
        aria-hidden
        className="mt-px h-7 w-7 flex-none"
        loading="lazy"
      />
      <span className="min-w-0">
        <span className="flex items-center gap-[7px]">
          <span className="text-[15px] font-medium leading-5 text-[#121212]">
            {item.name}
          </span>
          {item.badge && (
            <span className="bg-[#EEF2FF] px-2 py-px text-[12px] font-medium tracking-[0.02em] text-[#1742DF]">
              {item.badge}
            </span>
          )}
        </span>
        <span className="block whitespace-normal text-[12px] font-normal leading-[17px] text-[#4D4D4D]">
          {item.desc}
        </span>
      </span>
    </a>
  );
}

function GroupColumn({ group }: { group: Group }) {
  return (
    <div>
      <div className={`${CAPTION} mb-1.5`}>{group.caption}</div>
      <div className="flex flex-col">
        {group.rich
          ? group.items.map((item) => <RichRow key={item.name} item={item} />)
          : group.items.map((item) => (
              <a key={item.name} href="#top" className={ROW_PLAIN}>
                {item.name}
              </a>
            ))}
      </div>
    </div>
  );
}

function Rail({
  blocks,
  cardsCaption,
  cards,
  width,
}: {
  blocks?: RailBlock[];
  cardsCaption?: string;
  cards?: Card[];
  width: number;
}) {
  return (
    <div
      style={{ width }}
      className="flex flex-none flex-col gap-[34px] border-l border-[#E7E6DF] bg-white pb-[22px] pl-8 pr-6 pt-[26px]"
    >
      {blocks?.map((block) => (
        <div key={block.caption}>
          <div className={`${CAPTION} mb-1.5`}>{block.caption}</div>
          <div className="flex flex-col">
            {block.items.map((item) => (
              <a key={item} href="#top" className={ROW_PLAIN}>
                {item}
              </a>
            ))}
          </div>
        </div>
      ))}

      {cards && cards.length > 0 && (
        <div>
          <div className={`${CAPTION} mb-2.5`}>{cardsCaption}</div>
          <div className="flex flex-col gap-[14px]">
            {cards.map((card) => (
              <a key={card.name} href="#top" className="flex flex-col gap-2.5">
                <img
                  src={card.image}
                  alt=""
                  className="aspect-[4/3] w-full bg-[#F5F4F0] object-cover"
                  loading="lazy"
                />
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium leading-5 text-[#121212]">
                    {card.name}
                  </span>
                  <span className="mt-0.5 block whitespace-normal text-[13px] font-normal leading-[18px] text-[#4D4D4D]">
                    {card.desc}
                  </span>
                  {card.cta && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-[#1742DF]">
                      {card.cta} <span aria-hidden>→</span>
                    </span>
                  )}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PanelShell({
  width,
  children,
}: {
  width: number;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-x-0 top-full flex justify-center px-7 pt-1.5">
      <div
        style={{ width: "100%", maxWidth: width }}
        className="panel-in overflow-hidden border border-[#E7E6DF] bg-white shadow-[0_24px_60px_rgba(18,18,18,0.14)]"
      >
        {children}
      </div>
    </div>
  );
}

function ColumnsPanel({ menu }: { menu: PanelMenu }) {
  return (
    <PanelShell width={menu.width}>
      <div className="flex">
        <div
          className="grid flex-none pb-[22px] pl-7 pr-8 pt-[26px]"
          style={{ gridTemplateColumns: menu.cols, columnGap: menu.gap }}
        >
          {menu.groups.map((group) => (
            <GroupColumn key={group.caption} group={group} />
          ))}
        </div>
        <Rail
          blocks={menu.rail}
          cardsCaption={menu.cardsCaption}
          cards={menu.cards}
          width={menu.railWidth}
        />
      </div>
    </PanelShell>
  );
}

/* a product row in the new panels: name (+badge), optional one-liner */
function DescRow({ item }: { item: DescItem }) {
  return (
    <a
      href="#top"
      className="-mx-[9px] block px-[9px] py-[7px] transition-colors hover:bg-[#F5F4F0]"
    >
      <span className="flex items-center gap-[7px]">
        <span className="text-[15px] font-medium leading-5 text-[#121212]">
          {item.name}
        </span>
        {item.badge && (
          <span className="border border-[#1742DF] px-[6px] py-px font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-[#1742DF]">
            {item.badge}
          </span>
        )}
      </span>
      {item.desc && (
        <span className="mt-0.5 block whitespace-normal text-[13px] font-normal leading-[18px] text-[#4D4D4D]">
          {item.desc}
        </span>
      )}
    </a>
  );
}

function ProductsPanel({ menu }: { menu: ProductsMenu }) {
  return (
    <PanelShell width={menu.width}>
      <div className="flex gap-12 pb-[24px] pl-7 pr-8 pt-[26px]">
        {/* Kane, then the agents you build */}
        <div className="w-[330px] flex-none">
          <div className={`${CAPTION_MONO} mb-2`}>{menu.kane.caption}</div>
          <div className="flex flex-col gap-1">
            {menu.kane.items.map((item) => (
              <DescRow key={item.name} item={item} />
            ))}
          </div>
          <div className="my-5 border-t border-dashed border-[#D3D2CD]" />
          <div className={`${CAPTION_MONO} mb-2`}>{menu.agentTest.caption}</div>
          <div className="flex flex-col gap-1">
            {menu.agentTest.items.map((item) => (
              <DescRow key={item.name} item={item} />
            ))}
          </div>

          {/* the promo sits at the foot of the column, the way ElevenLabs
              introduces Music v2 — thumb, title, two grey lines, a link */}
          <a href="#top" className="group mt-9 block">
            <span className="flex h-11 w-11 items-center justify-center bg-[#121212] font-mono text-[12px] font-medium tracking-[0.06em] text-white">
              AA
            </span>
            <span className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-medium leading-5 text-[#121212]">
                {menu.assurance.name}
              </span>
              <span className="border border-[#1742DF] px-[6px] py-px font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-[#1742DF]">
                {menu.assurance.chip}
              </span>
            </span>
            <span className="mt-1 block max-w-[300px] whitespace-normal text-[13px] font-normal leading-[19px] text-[#4D4D4D]">
              {menu.assurance.body}
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1742DF]">
              {menu.assurance.cta}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </a>
        </div>

        <div className="w-[270px] flex-none">
          <div className={`${CAPTION_MONO} mb-3`}>{menu.cloud.caption}</div>
          <div className="flex flex-col gap-1">
            {menu.cloud.items.map((item) => (
              <DescRow key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div className="w-[250px] flex-none">
          <div className={`${CAPTION_MONO} mb-3`}>{menu.quality.caption}</div>
          <div className="flex flex-col gap-1">
            {menu.quality.items.map((item) => (
              <DescRow key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

function SolutionsPanel({ menu }: { menu: GridMenu }) {
  return (
    <PanelShell width={menu.width}>
      <div className="flex gap-12 pb-[24px] pl-7 pr-8 pt-[26px]">
        <div className="flex-none">
          <div className={`${CAPTION_MONO} mb-3`}>By use case</div>
          <div className="grid auto-rows-[34px] grid-cols-[218px_218px] gap-x-8 [grid-auto-flow:column] [grid-template-rows:repeat(8,34px)]">
            {menu.useCases.map((useCase) => (
              <a key={useCase} href="#top" className={ROW_PLAIN}>
                {useCase}
              </a>
            ))}
          </div>
        </div>

        <div className="w-[248px] flex-none">
          <div className={`${CAPTION_MONO} mb-3`}>By team size</div>
          <div className="flex flex-col">
            {menu.teamSize.map((size) => (
              <a key={size} href="#top" className={ROW_PLAIN}>
                {size}
              </a>
            ))}
          </div>
          <div className="mt-6">
            <span className="block text-[15px] font-medium leading-5 text-[#121212]">
              {menu.quote.title}
            </span>
            <a
              href="#top"
              className="mt-1.5 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1742DF] transition-colors hover:text-[#1433A4]"
            >
              {menu.quote.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="w-[170px] flex-none">
          <div className={`${CAPTION_MONO} mb-3`}>Test what AI builds</div>
          <div className="flex flex-col">
            {menu.aiBuilds.map((tool) => (
              <a key={tool} href="#top" className={ROW_PLAIN}>
                {tool}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#E7E6DF] px-7 pb-[22px] pt-[18px]">
        <div className={`${CAPTION} mb-2.5`}>Enterprise apps we test</div>
        <div className="flex flex-wrap gap-1.5">
          {menu.erp.map((app) => (
            <a
              key={app}
              href="#top"
              className="flex-none whitespace-nowrap border border-[#E7E6DF] bg-[#FAFAF8] px-[11px] py-1 text-[13px] font-medium leading-[18px] text-[#121212] transition-colors hover:border-[#121212]"
            >
              {app}
            </a>
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

export default function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [section, setSection] = useState<string | null>("products");
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* a short delay so diagonal travel from button to panel doesn't dismiss it */
  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(null), CLOSE_DELAY);
  };

  const active = NAV.find((n) => n.key === open);

  return (
    <>
      <div className="flex h-10 items-center justify-center gap-2.5 bg-[#121212] text-[13px] font-medium leading-none text-white">
        <span>{announcement.text}</span>
        <a href="#top" className="border-b border-white/45 pb-0.5 text-white">
          {announcement.cta}
        </a>
      </div>

      <div
        className="sticky top-0 z-50 bg-[#F5F4F0]"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-8 px-7">
          <a href="#top" className="flex flex-none items-center">
            <img
              src="/testmu-logo-dark.svg"
              alt="TestMu AI"
              className="h-6 w-auto"
            />
          </a>

          <nav className="hidden flex-none items-center gap-0.5 min-[1181px]:flex">
            {NAV.map((item) => (
              <button
                key={item.key}
                aria-expanded={open === item.key}
                aria-controls={
                  item.kind === "plain" ? undefined : `panel-${item.key}`
                }
                onMouseEnter={() => {
                  cancelClose();
                  setOpen(item.kind === "plain" ? null : item.key);
                }}
                onClick={() =>
                  setOpen(
                    item.kind === "plain"
                      ? null
                      : open === item.key
                        ? null
                        : item.key,
                  )
                }
                className={`cursor-pointer whitespace-nowrap rounded-[8px] px-3 py-2 text-[15px] font-medium text-[#121212] transition-colors ${
                  open === item.key ? "bg-[#E7E6DF]" : "bg-transparent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex flex-none items-center gap-2.5 min-[1181px]:hidden">
            <span className="text-[17px] text-[#4D4D4D]">⌕</span>
            <button
              onClick={() => {
                setDrawer((d) => !d);
                setOpen(null);
              }}
              className="flex h-[38px] cursor-pointer items-center gap-2 rounded-[8px] border border-[#D3D2CD] bg-white px-3.5 text-[15px] font-medium text-[#121212]"
            >
              Menu ☰
            </button>
          </div>

          <div className="ml-auto hidden flex-none items-center gap-3.5 min-[1181px]:flex [&>*]:flex-none [&_a]:whitespace-nowrap">
            <span className="flex items-center gap-[7px] font-mono text-[13px] text-[#4D4D4D]">
              ⌕ <span>{headerActions.search}</span>
            </span>
            <a href="#top" className="text-[15px] font-medium text-[#4D4D4D]">
              {headerActions.signIn}
            </a>
            <a
              href="#top"
              className="flex h-[38px] items-center rounded-[10px] border border-[#D3D2CD] bg-white px-4 text-[15px] font-medium text-[#121212] transition-colors hover:border-[#121212]"
            >
              {headerActions.sales}
            </a>
            <a
              href="#top"
              className="flex h-[38px] items-center gap-1.5 rounded-[10px] bg-[#121212] px-[18px] text-[15px] font-medium text-white"
            >
              {headerActions.start} <span className="opacity-60">→</span>
            </a>
          </div>
        </div>

        {active?.kind === "products" && (
          <div id={`panel-${active.key}`}>
            <ProductsPanel menu={active} />
          </div>
        )}
        {active?.kind === "panel" && (
          <div id={`panel-${active.key}`}>
            <ColumnsPanel menu={active} />
          </div>
        )}
        {active?.kind === "grid" && (
          <div id={`panel-${active.key}`}>
            <SolutionsPanel menu={active} />
          </div>
        )}

        {drawer && (
          <div className="panel-in absolute inset-x-0 top-full max-h-[78vh] overflow-auto border-t border-[#E7E6DF] bg-white shadow-[0_24px_60px_rgba(18,18,18,0.14)]">
            <div className="px-[22px] pb-[26px] pt-3.5">
              {NAV.map((item) => {
                const on = item.kind !== "plain" && section === item.key;
                const lists: { caption: string; items: string[] }[] = [];
                if (item.kind === "products") {
                  lists.push({
                    caption: item.kane.caption,
                    items: item.kane.items.map((i) => i.name),
                  });
                  lists.push({
                    caption: item.agentTest.caption,
                    items: item.agentTest.items.map((i) => i.name),
                  });
                  lists.push({
                    caption: item.cloud.caption,
                    items: item.cloud.items.map((i) => i.name),
                  });
                  lists.push({
                    caption: item.quality.caption,
                    items: item.quality.items.map((i) => i.name),
                  });
                  lists.push({
                    caption: item.assurance.eyebrow,
                    items: [item.assurance.name],
                  });
                } else if (item.kind === "grid") {
                  lists.push({ caption: "By use case", items: item.useCases });
                  lists.push({ caption: "By team size", items: item.teamSize });
                  lists.push({
                    caption: "Test what AI builds",
                    items: item.aiBuilds,
                  });
                  lists.push({
                    caption: "Enterprise apps we test",
                    items: item.erp,
                  });
                } else if (item.kind === "panel") {
                  item.groups.forEach((g) =>
                    lists.push({
                      caption: g.caption,
                      items: g.items.map((i) => i.name),
                    }),
                  );
                  item.rail?.forEach((r) =>
                    lists.push({ caption: r.caption, items: r.items }),
                  );
                }

                return (
                  <div key={item.key} className="border-b border-[#E7E6DF]">
                    <button
                      onClick={() => setSection(on ? null : item.key)}
                      className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent py-4 text-[17px] font-medium text-[#121212]"
                    >
                      {item.label}
                      <span className="text-[18px] text-[#4D4D4D]">
                        {item.kind === "plain" ? "" : on ? "−" : "+"}
                      </span>
                    </button>
                    {on && (
                      <div className="flex flex-col gap-4 pb-[18px] pt-1">
                        {lists.map((list) => (
                          <div key={list.caption}>
                            <div className="mb-1.5 text-[14px] font-normal text-[#7F7F7E]">
                              {list.caption}
                            </div>
                            <div
                              className={
                                list.items.length > 6
                                  ? "grid grid-cols-2 gap-x-3"
                                  : "flex flex-col"
                              }
                            >
                              {list.items.map((entry) => (
                                <a
                                  key={entry}
                                  href="#top"
                                  className="flex min-h-[44px] items-center border-b border-[#F5F4F0] text-[15px] font-medium text-[#121212]"
                                >
                                  {entry}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="mt-[22px] flex flex-col gap-2.5">
                <a
                  href="#top"
                  className="flex h-12 items-center justify-center rounded-[10px] bg-[#121212] text-[16px] font-medium text-white"
                >
                  Start now →
                </a>
                <a
                  href="#top"
                  className="flex h-12 items-center justify-center rounded-[10px] border border-[#121212] text-[16px] font-medium text-[#121212]"
                >
                  Contact sales
                </a>
                <a
                  href="#top"
                  className="flex h-11 items-center justify-center text-[16px] font-medium text-[#4D4D4D]"
                >
                  Sign in
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
