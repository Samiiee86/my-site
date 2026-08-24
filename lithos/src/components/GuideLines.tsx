/* The vertical rules that frame the content column, Linear-style.
   Sits behind the sections; every section is transparent so they show through. */
export default function GuideLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex justify-center px-5 sm:px-8"
    >
      <div className="relative h-full w-full max-w-[1240px]">
        <span className="absolute inset-y-0 -left-px w-px bg-border" />
        <span className="absolute inset-y-0 -right-px w-px bg-border" />
      </div>
    </div>
  );
}
