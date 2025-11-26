import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.static(".")); // serve your HTML + assets

// ===== CONFIG =====
const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAANNA5AEAAAAAhO6dmQ9QDg9cCeK7a6jLa9h4d3c%3DjHE3q1zV6gJRTcM9b0lidDUX59c4c2ZbXADwfUL1r35ofkHPPn";
const USERNAME = "YokaieSportGG";
// ==================

// Helper: Get user ID from username
async function getUserId() {
  const res = await fetch(`https://api.x.com/2/users/by/username/${USERNAME}`, {
    headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
  });
  const data = await res.json();
  if (!data.data) throw new Error("Failed to get user ID");
  return data.data.id;
}

// Route: Fetch tweets
app.get("/api/tweets", async (req, res) => {
  try {
    const userId = await getUserId();
    const url = `https://api.x.com/2/users/${userId}/tweets?max_results=5&tweet.fields=created_at`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } });
    const data = await r.json();

    if (!data.data) throw new Error(JSON.stringify(data, null, 2));

    const tweets = data.data.map(t => ({
      id: t.id,
      text: t.text,
      username: USERNAME,
    }));

    res.json({ tweets });
  } catch (e) {
    console.error("❌ Error fetching tweets:", e.message);
    res.status(500).json({ error: "Failed to fetch tweets" });
  }
});

app.listen(8000, () => console.log("✅ Server running at http://localhost:8000"));
