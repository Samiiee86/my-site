import { MotionConfig } from "motion/react";
import CursorPill from "./components/CursorPill";
import ScrollProgress from "./components/ScrollProgress";
import GuideLines from "./components/GuideLines";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustedBy from "./sections/TrustedBy";
import Bento from "./sections/Bento";
import Flow from "./sections/Flow";
import Products from "./sections/Products";
import Stories from "./sections/Stories";
import Reasons from "./sections/Reasons";
import Rebrand from "./sections/Rebrand";
import Faq from "./sections/Faq";
import Enterprise from "./sections/Enterprise";
import Footer from "./sections/Footer";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-background font-body">
        <ScrollProgress />
        <CursorPill />
        <Header />

        {/* navbar + hero fill the first screen */}
        <div className="flex h-[calc(100vh-104px)] flex-col overflow-hidden">
          <Hero />
        </div>

        <main className="relative">
          <GuideLines />

          <TrustedBy />
          <Bento />
          <Flow />
          <Products />
          <Stories />
          <Reasons />
          <Rebrand />
          <Faq />
          <Enterprise />
          <Footer />
        </main>
      </div>
    </MotionConfig>
  );
}
