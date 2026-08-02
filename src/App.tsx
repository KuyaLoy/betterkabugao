import { BuildThemes } from "./components/BuildThemes";
import { LaunchHero } from "./components/LaunchHero";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <main id="main-content">
        <LaunchHero />
        <BuildThemes />
      </main>
      <SiteFooter />
    </div>
  );
}
