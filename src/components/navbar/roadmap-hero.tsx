// import { getTotalRoadmapsGenerated } from "@/actions/roadmaps";
import RoadmapHeroClient from "./roadmap-hero.client";

export default async function RoadmapHero() {
  // const totalRoadmaps = await getTotalRoadmapsGenerated().catch(() => 0);
  const totalRoadmaps = 100;

  const trendyRoadmaps = {
    Backend: "cluqobxvs003shc0agvoh0f50",
    Frontend: "cluik00o6001lye79osk1301z",
    "Web 3": "cluik0y12001oye79i3mq6s0q",
    "Machine Learning": "clupklkxg0012ej06fsx0gxui",
  };

  return (
    <RoadmapHeroClient
      totalRoadmaps={Number(totalRoadmaps) || 0}
      trendyRoadmaps={trendyRoadmaps}
      applyTopOffset
      topOffset={150}
    />
  );
}