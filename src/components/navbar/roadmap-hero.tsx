// import { getTotalRoadmapsGenerated } from "@/actions/roadmaps";
import RoadmapHeroClient from "./roadmap-hero.client";

export default async function RoadmapHero({ phase = "4" }: { phase?: string }) {
  // const totalRoadmaps = await getTotalRoadmapsGenerated().catch(() => 0);
  const totalRoadmaps = 100;

  const trendyRoadmaps = {
    "AIML Engineer": "9",
    "Cyber Security Engineer": "8",
    "Devops Engineer": "7",
    "Full Stack Web Development": "6",

  };

  return (
    <RoadmapHeroClient
      phase={phase}
      totalRoadmaps={Number(totalRoadmaps) || 0}
      trendyRoadmaps={trendyRoadmaps}
      applyTopOffset
      topOffset={150}
    />
  );
}