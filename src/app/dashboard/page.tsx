import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth(); // ✅ await the Promise

  if (!userId) {
    // user is not signed in
    return <p>Please sign in to view this page.</p>;
  }

  return <h1>Welcome user {userId}!</h1>;
}
