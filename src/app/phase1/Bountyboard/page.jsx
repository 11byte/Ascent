import BountyBoard from "../../../components/BountyBoard";

const defaultBounties = [
  {
    id: 1,
    title: "Build a Mini REST API",
    domain: "Web Dev",
    points: 80,
    difficulty: "Medium",
    description: "Create a simple CRUD API",
  },
  {
    id: 2,
    title: "Train a Basic ML Model",
    domain: "AI/ML",
    points: 100,
    difficulty: "Hard",
    description: "Train classifier on dataset",
  },
  {
    id: 3,
    title: "Create Sorting Visualizer",
    domain: "DSA",
    points: 70,
    difficulty: "Medium",
    description: "Visualize sorting algorithms",
  },
];

const phase1Theme = {
  tBorder: {
    light: "#B8D7F5", // soft sky blue (muted, elegant)
    dark: "#2A3A4A",
  },
  tColor: {
    light: "#E6B85C", // warm gold (premium, not flashy yellow)
    dark: "#C89B3C",
  },
  tDepthColor: {
    light: "#C94F5C", // muted rose (less saturation, richer)
    dark: "#7A2E35",
  },
};

const clubBounties = [
  {
    id: 100,
    title: "Build a Real-time Chat App",
    domain: "Web Dev",
    points: 120,
    difficulty: "Hard",
    description: "Use sockets to build chat system",
    createdBy: "Coding Club",
  },
];

export default function Page() {
  return (
    <BountyBoard
      theme={phase1Theme}
      defaultBounties={defaultBounties}
      clubBounties={clubBounties}
    />
  );
}
