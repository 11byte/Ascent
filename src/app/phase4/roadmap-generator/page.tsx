import RoadmapHero from "../../../components/navbar/roadmap-hero";
export const metadata = {
  title: "AI Roadmap Generator",
  description: "Curate personalized learning paths with a single prompt.",
};

export default function Roadmap() {
  // If your layout already adds top padding for the fixed navbar (pt-[70px]),
  // remove the className below to avoid double spacing.
  return (
    <main>
      <RoadmapHero />
      {/* Add more sections below */}
    </main>
  );
}