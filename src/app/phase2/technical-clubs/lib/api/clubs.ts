export async function getClubData() {
  const res = await fetch("/api/clubs/aiml");

  if (!res.ok) {
    throw new Error("Failed to fetch club data");
  }

  return res.json();
}
