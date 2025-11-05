"use client";
import { useState } from "react";

interface TimelineChild {
  id: string;
  name: string;
  color: string;
}

interface TimelineSubNode {
  id: string;
  name: string;
  color: string;
  children: TimelineChild[];
}

interface TimelinePhase {
  id: number;
  roman: string;
  title: string;
  color: string;
  subNodes: TimelineSubNode[];
}

interface TimelineData {
  phases: TimelinePhase[];
}

export default function TimelineCollector({
  onTimelineUpdate,
}: {
  onTimelineUpdate?: (data: any[]) => void;
}) {
  const [timelineData, setTimelineData] = useState<TimelineData>({
    phases: [],
  });
  const [loading, setLoading] = useState(false);

  const [phaseTitle, setPhaseTitle] = useState("");
  const [subNodeName, setSubNodeName] = useState("");
  const [achievement, setAchievement] = useState("");

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || "guest"
      : "guest";

  // ✅ Add new phase
  const addPhase = () => {
    if (!phaseTitle) return alert("Enter a phase title");
    setTimelineData((prev) => ({
      phases: [
        ...prev.phases,
        {
          id: prev.phases.length + 1,
          roman: ["I", "II", "III", "IV"][prev.phases.length] || "?",
          title: phaseTitle,
          color: "#00E5FF",
          subNodes: [],
        },
      ],
    }));
    setPhaseTitle("");
    const updatedPhases = [...timelineData.phases];
    onTimelineUpdate?.(updatedPhases);
  };

  // ✅ Add sub-node
  const addSubNode = () => {
    if (!subNodeName || timelineData.phases.length === 0)
      return alert("Add a phase first");

    const updatedPhases = [...timelineData.phases];
    const lastPhase = updatedPhases[updatedPhases.length - 1];
    lastPhase.subNodes.push({
      id: `${lastPhase.id}-${lastPhase.subNodes.length + 1}`,
      name: subNodeName,
      color: "#FF81C9",
      children: [],
    });

    setTimelineData({ phases: updatedPhases });
    setSubNodeName("");
    onTimelineUpdate?.(updatedPhases);
  };

  // ✅ Add achievement
  const addAchievementItem = () => {
    if (!achievement || timelineData.phases.length === 0)
      return alert("Add a subnode first");

    const updatedPhases = [...timelineData.phases];
    const lastPhase = updatedPhases[updatedPhases.length - 1];
    const lastSub = lastPhase.subNodes[lastPhase.subNodes.length - 1];

    if (!lastSub) return alert("No subnode found");

    lastSub.children.push({
      id: `${lastSub.id}-${lastSub.children.length + 1}`,
      name: achievement,
      color: "#ffcff2",
    });

    setTimelineData({ phases: updatedPhases });
    setAchievement("");
    onTimelineUpdate?.(updatedPhases);
  };

  // ✅ Sync to backend (Kafka)
  const syncToPipeline = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/timeline/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, timelineData }),
      });

      const result = await res.json();
      console.log("✅ Synced to Kafka:", result);
      alert("Timeline synced successfully!");
    } catch (err) {
      console.error("❌ Sync failed:", err);
      alert("Error syncing timeline data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ The same JSX UI as before (no change below this point)
  return (
    <div className="p-6 bg-[#0b0b12] rounded-2xl border border-white/10 text-white max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-3 text-[#00E5FF]">
        🪶 Timeline Data Builder
      </h2>

      {/* Phase input */}
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 px-3 py-2 rounded-md text-white"
          placeholder="Add new phase title (e.g. Foundation)"
          value={phaseTitle}
          onChange={(e) => setPhaseTitle(e.target.value)}
        />
        <button
          onClick={addPhase}
          className="px-4 py-2 bg-emerald-500 rounded-md hover:bg-emerald-600"
        >
          Add Phase
        </button>
      </div>

      {/* SubNode input */}
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 px-3 py-2 rounded-md text-white"
          placeholder="Add sub-node (e.g. Core Academics)"
          value={subNodeName}
          onChange={(e) => setSubNodeName(e.target.value)}
        />
        <button
          onClick={addSubNode}
          className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Add SubNode
        </button>
      </div>

      {/* Achievement input */}
      <div className="flex gap-2 mb-4 text-white">
        <input
          className="flex-1 px-3 py-2 rounded-md text-white"
          placeholder="Add achievement (e.g. Top Grades in Math)"
          value={achievement}
          onChange={(e) => setAchievement(e.target.value)}
        />
        <button
          onClick={addAchievementItem}
          className="px-4 py-2 bg-pink-500 rounded-md hover:bg-pink-600"
        >
          Add Achievement
        </button>
      </div>

      <button
        onClick={syncToPipeline}
        disabled={loading}
        className={`px-6 py-2 rounded-md font-semibold ${
          loading ? "bg-gray-600" : "bg-[#FF2EC8] hover:bg-[#ff4ee2]"
        }`}
      >
        {loading ? "Syncing..." : "🚀 Sync to Pipeline"}
      </button>
    </div>
  );
}
