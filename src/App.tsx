import { CreatureStage } from "./stage/CreatureStage";
import { AnchorView } from "./stage/AnchorView";
import { Hero } from "./ui/Hero";
import { VideoBlock } from "./ui/VideoBlock";
import { Disclosure } from "./ui/Disclosure";
import { Briefing } from "./ui/Briefing";
import { DownloadCTA } from "./ui/DownloadCTA";
import { InstallGuide } from "./ui/InstallGuide";
import { Footer } from "./ui/Footer";

export function App() {
  return (
    <>
      <div className="bg-grain" aria-hidden="true" />
      <img
        className="tink-falling-fixed"
        src={`${import.meta.env.BASE_URL}tink-falling-small.png`}
        alt=""
        aria-hidden="true"
      />
      <CreatureStage />
      <AnchorView />
      <main className="page">
        <Hero />
        <VideoBlock />
        <Disclosure />
        <Briefing />
        <DownloadCTA />
        <InstallGuide />
      </main>
      <Footer />
    </>
  );
}
