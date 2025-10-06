'use client';
import GitHubConnect from "@/components/GithubConnect";

export default function Phase1GitHubConnectPage() {
  const userId = "YOUR_USER_ID"; // Replace with actual user id from your auth system

  return (
    <div className="max-w-lg mx-auto mt-32">
      <h1 className="text-2xl font-bold mb-6">Connect your GitHub</h1>
      <GitHubConnect userId={userId} />
    </div>
  );
}