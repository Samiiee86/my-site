import { SiteNav } from "./components/site-nav";
import { Hero } from "./components/hero";
import { Intro } from "./components/intro";
import { Specs } from "./components/specs";
import { Gallery } from "./components/gallery";
import { Reserve } from "./components/reserve";
import { SiteFooter } from "./components/site-footer";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="top" className="flex-1">
        <Hero />
        <Intro />
        <Specs />
        <Gallery />
        <Reserve />
      </main>
      <SiteFooter />
    </>
  );
}
