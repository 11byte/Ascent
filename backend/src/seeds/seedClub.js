import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const club = await prisma.club.create({
    data: {
      name: "AIML Club",
      tagline: "Building intelligent systems",
      description: "AI-focused club",
      president: "Omkar",

      events: {
        create: [
          {
            title: "Intro to ML",
            date: "12 FEB",
            time: "3 PM",
            venue: "Lab 3",
            speaker: "Dr. Sharma",
            status: "UPCOMING",
          },
        ],
      },

      challenges: {
        create: [
          {
            title: "Build Classifier",
            description: "Train ML model",
            points: 100,
          },
        ],
      },

      members: {
        create: [
          { name: "Omkar", role: "President", tier: "president" },
          { name: "Rahul", role: "VP", tier: "vp" },
          { name: "Amit", role: "Member", tier: "member" },
        ],
      },
    },
  });

  console.log("✅ Club created:", club.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
