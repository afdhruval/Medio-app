import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function LeftSidebar() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("/user/all")
      .then((r) => setUsers(r.data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleFollow = async (user) => {
    const endpoint = user.isFollowing
      ? `/user/unfollow/${user.username}`
      : `/user/follow/${user.username}`;

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u._id === user._id ? { ...u, isFollowing: !u.isFollowing } : u
      )
    );

    try {
      await api.post(endpoint);
    } catch {
      // Revert on error
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isFollowing: user.isFollowing } : u
        )
      );
    }
  };

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Panel>
        <SectionLabel>All Users</SectionLabel>

        {loading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <Muted>No other users yet.</Muted>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {users.map((u) => (
              <UserRow key={u._id} user={u} onToggle={() => toggleFollow(u)} />
            ))}
          </div>
        )}

        <Muted style={{ marginTop: 14 }}>
          all the users — with the follow button. if any user want to follow
          they can easily follow from this box
        </Muted>
      </Panel>
    </aside>
  );
}

function UserRow({ user, onToggle }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <Avatar src={user.profileImage} name={user.username} size={30} />
        <span style={{ fontSize: 13, color: "#ccc", fontWeight: 500 }}>
          {user.username}
        </span>
      </div>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          height: 28,
          padding: "0 12px",
          borderRadius: 20,
          border: user.isFollowing ? "1px solid #2a2a2a" : "1px solid #0095f6",
          background: "none",
          color: user.isFollowing
            ? hov ? "#e05555" : "#555"
            : hov ? "#fff" : "#0095f6",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.18s",
          whiteSpace: "nowrap",
        }}
      >
        {user.isFollowing ? (hov ? "Unfollow" : "Following") : "Follow"}
      </button>
    </div>
  );
}

/* ── shared tiny components ── */
export function Avatar({ src, name = "?", size = 34 }) {
  const [err, setErr] = useState(false);
  const letter = (name || "?")[0].toUpperCase();

  if (!src || err) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.38, fontWeight: 700, color: "#fff",
      }}>
        {letter}
      </div>
    );
  }
  return (
    <img
      src={src} alt={name} onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  );
}

export function Panel({ children, style }) {
  return (
    <div style={{
      background: "#0d0d0d",
      border: "1px solid #1a1a1a",
      borderRadius: 16,
      padding: "18px 16px",
      ...style,
    }}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700, color: "#333",
      letterSpacing: "0.15em", textTransform: "uppercase",
      margin: "0 0 14px",
    }}>
      {children}
    </p>
  );
}

export function Muted({ children, style }) {
  return (
    <p style={{ fontSize: 12, color: "#2e2e2e", margin: 0, lineHeight: 1.6, ...style }}>
      {children}
    </p>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
      <span className="spinner" style={{
        width: 18, height: 18,
        border: "2px solid #1e1e1e",
        borderTopColor: "#444",
        borderRadius: "50%",
        display: "inline-block",
      }} />
    </div>
  );
}
