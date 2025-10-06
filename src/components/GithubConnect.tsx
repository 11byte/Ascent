import { useState, useEffect } from "react";

// Props: userId is your website's user ID (from your own auth system)
export default function GitHubConnect({ userId }: { userId: string }) {
  const [status, setStatus] = useState<"checking"|"connected"|"notconnected">("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user already connected
    fetch(`https://localhost:5000/api/github/usertokenexist/?userId=${userId}`)
      .then(res => res.json())
      .then(data => setStatus(data.token ? "connected" : "notconnected"))
      .catch(() => setStatus("notconnected"));
  }, [userId]);

  // After OAuth, backend should redirect to /phase1/githubconnect/?token=...
  useEffect(() => {
    // If redirected back to this page with token in query, store it in backend
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      fetch("https://localhost:5000/api/github/storetoken/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus("connected");
            // Optionally, redirect to tracker after storing
            window.location.href = "/phase1/githubtracker/";
          } else {
            setError("Failed to store GitHub token.");
          }
        })
        .catch(() => setError("Failed to store GitHub token."));
    }
  }, [userId]);

  function handleConnect() {
    // Start OAuth flow via backend
    window.location.href = `https://localhost:5000/api/github/oauth/start?userId=${userId}`;
  }

  if (status === "checking") return <div>Checking GitHub connection...</div>;
  if (status === "connected") return <div>✅ GitHub connected! Redirecting to tracker...</div>;
  return (
    <div className="text-center">
      <p>Connect your GitHub account to use the tracker features.</p>
      <button
        className="px-6 py-3 rounded-xl bg-black text-white font-bold mt-4"
        onClick={handleConnect}
      >
        Connect to GitHub
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}