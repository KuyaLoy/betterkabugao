import { ExploreSection } from "./components/ExploreSection";
import { Hero } from "./components/Hero";
import { HotlineBar } from "./components/HotlineBar";
import { IntroSection } from "./components/IntroSection";
import { MissionSection } from "./components/MissionSection";
import { ServicesSection } from "./components/ServicesSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { TransparencySection } from "./components/TransparencySection";
import { UtilityStrip } from "./components/UtilityStrip";

export function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <HotlineBar />
      <UtilityStrip />
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <IntroSection />
        <TransparencySection />
        <ExploreSection />
        <ServicesSection />
        <MissionSection />
      </main>
      <SiteFooter />
    </>
  );
}
