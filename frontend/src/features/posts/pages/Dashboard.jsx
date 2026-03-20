import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { getUser } from "../../../utils/auth";
import Navbar from "../../../components/Navbar";
import LeftSidebar, { Avatar, Panel, Spinner } from "../../../components/LeftSidebar";
import RightSidebar from "../../../components/RightSidebar";
import PostCard from "../../../components/PostCard";

export default function Dashboard() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const user = getUser();
  const navigate = useNavigate();

  const fetchFeed = useCallback(async () => {
    setError("");
    try {
      // GET /api/post/feed  → { message, posts: [...] }
      const res = await api.get("/post/feed");
      setPosts(res.data.posts || []);
    } catch {
      setError("Could not load posts. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <Navbar />

      {/* ── 3-column grid (matches wireframe exactly) ── */}
      <div style={{
        maxWidth: 1260,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "260px minmax(0,1fr) 260px",
        gap: 14,
        padding: "80px 14px 40px",
        alignItems: "start",
      }}>

        {/* ── LEFT: all users + follow ── */}
        <div style={{ position: "sticky", top: 78 }}>
          <LeftSidebar />
        </div>

        {/* ── CENTER: feed ── */}
        <main>
          {/* Welcome bar */}
          {user && (
            <Panel style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar src={user.profileImage} name={user.username} size={38} />
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#e0e0e0" }}>
                  {user.username}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#333" }}>Welcome back 👋</p>
              </div>
            </Panel>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(238,42,123,0.06)",
              border: "1px solid rgba(238,42,123,0.15)",
              borderRadius: 12,
              color: "#ee2a7b",
              fontSize: 13,
              padding: "11px 14px",
              marginBottom: 14,
            }}>{error}</div>
          )}

          {/* Posts */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[1, 2].map((i) => <SkeletonPost key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <Panel style={{ textAlign: "center", padding: "48px 20px" }}>
              <p style={{ margin: 0, color: "#2e2e2e", fontSize: 14 }}>
                No posts yet.{" "}
                <span
                  onClick={() => navigate("/create")}
                  style={{ color: "#0095f6", cursor: "pointer", fontWeight: 600 }}
                >
                  Create the first one!
                </span>
              </p>
            </Panel>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onRefresh={fetchFeed} />
            ))
          )}
        </main>

        {/* ── RIGHT: comments ── */}
        <div style={{ position: "sticky", top: 78 }}>
          <RightSidebar posts={posts} />
        </div>

      </div>

    </div>
  );
}

function SkeletonPost() {
  return (
    <div style={{
      background: "#0d0d0d",
      border: "1px solid #1a1a1a",
      borderRadius: 16,
      overflow: "hidden",
    }}>
      <div style={{ height: 54, background: "#111", borderBottom: "1px solid #141414" }} />
      <div style={{ height: 260, background: "#080808" }} />
      <div style={{ height: 44, background: "#0d0d0d", borderTop: "1px solid #141414" }} />
    </div>
  );
}


