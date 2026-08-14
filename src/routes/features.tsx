import { createFileRoute } from "@tanstack/react-router";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HeroSection from "../components/features/HeroSection";
import FeatureGrid from "../components/features/FeatureGrid";
import Workflow from "../components/features/Workflow";
import Stats from "../components/features/Stats";
import FAQ from "../components/features/FAQ";
import CTA from "../components/features/CTA";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#050816] text-white">
        <HeroSection />
        <FeatureGrid />
        <Workflow />
        <Stats />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </>
  );
}