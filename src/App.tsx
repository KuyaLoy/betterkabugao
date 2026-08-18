import { Route, Routes } from "react-router-dom";
import { EmergencyPage } from "./pages/EmergencyPage";
import { HotlineBar } from "./components/HotlineBar";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { UtilityStrip } from "./components/UtilityStrip";
import { BarangayDetailPage } from "./pages/BarangayDetailPage";
import { BarangaysPage } from "./pages/BarangaysPage";
import { HomePage } from "./pages/HomePage";
import { OfficialsPage } from "./pages/OfficialsPage";
import {
  AboutPage,
  ExplorePage,
  GovernmentPage,
  NotFoundPage,
  SearchPage,
  ServicesPage,
  TransparencyPage,
} from "./pages/SimplePages";

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/government" element={<GovernmentPage />} />
          <Route path="/government/officials" element={<OfficialsPage />} />
          <Route path="/government/barangays" element={<BarangaysPage />} />
          <Route path="/government/barangays/:slug" element={<BarangayDetailPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<SearchPage />} />
          {/* No bare catch-all like /:slug — a real 404 must stay reachable. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
