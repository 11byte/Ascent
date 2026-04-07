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

const phase4Theme = {
  tBorder: { light: "#F3F3E0", dark: "#F3F3E0" },
  tColor: { light: "#DDA853 ", dark: "#DDA853" },
  tDepthColor: { light: "#327599", dark: "#327599" },
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
      theme={phase4Theme}
      defaultBounties={defaultBounties}
      clubBounties={clubBounties}
    />
  );
}
