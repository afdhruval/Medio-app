import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiMessageCircle, FiSend, FiBookmark } from "react-icons/fi";
import { BsBookmarkFill, BsThreeDots, BsEmojiSmile } from "react-icons/bs";
import api from "../utils/api";
import { getUser } from "../utils/auth";
import { Avatar } from "./LeftSidebar";

export default function PostCard({ post, onRefresh }) {
  const [liked,      setLiked]      = useState(post.isLiked || false);
  const [likeCount,  setLikeCount]  = useState(post.likesCount || 0);
  const [saved,      setSaved]      = useState(false);
  const [showInput,  setShowInput]  = useState(false);
  const [showOptions,setShowOptions]= useState(false);
  const [comment,    setComment]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const loggedInUser = getUser();

  const username   = post.user?.username || "user";
  const avatar     = post.user?.profileImage || "";
  const timeAgo    = formatAgo(post.createdAt);

  /* ── Like: POST /api/post/like/:postId ── */
  const handleLike = async () => {
    const prev = liked;
    setLiked(!prev);
    setLikeCount((c) => (prev ? c - 1 : c + 1));
    try {
      const res = await api.post(`/post/like/${post._id}`);
      if (res.data.liked === false) {
        // Unliked on backend
        // State is already updated properly optimistically
      }
    } catch {
      setLiked(prev);
      setLikeCount((c) => (prev ? c + 1 : c - 1));
    }
  };

  const handleDoubleClick = () => { if (!liked) handleLike(); };

  /* ── Comment: if backend has a comment route add it here ── */
  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      // Adjust route if your backend adds a comment endpoint
      await api.post(`/post/comment/${post._id}`, { text: comment });
      setComment("");
      setShowInput(false);
      if (onRefresh) onRefresh();
    } catch {
      // silent — backend may not have comment route yet
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/post/delete/${post._id}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  return (
    <article
      className="fade-up"
      style={{
        background: "#0d0d0d",
        border: "1px solid #1a1a1a",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      {/* ── Header: username bar (matches wireframe) ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        borderBottom: "1px solid #141414",
        background: "#111",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar src={avatar} name={username} size={34} />
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#ececec" }}>
              {username}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#383838" }}>{timeAgo}</p>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowOptions(!showOptions)} style={{ background: "none", border: "none", color: "#383838", cursor: "pointer", fontSize: 17, lineHeight: 1 }}>
            <BsThreeDots />
          </button>
          
          {showOptions && loggedInUser?.username === username && (
            <div style={{
              position: "absolute", top: 24, right: 0,
              background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: 4, zIndex: 10,
              width: 100
            }}>
              <button onClick={handleDelete} style={{ color: "#ed4956", background: "none", border: "none", padding: "8px 12px", cursor: "pointer", fontSize: 13, width: "100%", textAlign: "left", fontWeight: 600 }}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Image / insta post area ── */}
      <div
        style={{ background: "#080808", cursor: "pointer", minHeight: 220 }}
        onDoubleClick={handleDoubleClick}
      >
        {post.imgUrl ? (
          <img
            src={post.imgUrl}
            alt="post"
            draggable={false}
            style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 500 }}
          />
        ) : (
          <div style={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1e1e1e",
            fontSize: 12,
            letterSpacing: "0.1em",
          }}>
            insta post
          </div>
        )}
      </div>

      {/* ── Caption ── */}
      {post.caption && (
        <div style={{ padding: "10px 14px 2px" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#888", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: "#bbb", marginRight: 6 }}>{username}</span>
            {post.caption}
          </p>
        </div>
      )}

      {/* ── Like count ── */}
      {likeCount > 0 && (
        <p style={{ margin: "8px 14px 0", fontSize: 13, fontWeight: 600, color: "#ccc" }}>
          {likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
        </p>
      )}

      {/* ── Action bar: like · comment · save btn (matches wireframe label) ── */}
      <div style={{
        borderTop: "1px solid #141414",
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px 14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Like */}
          <ActionIcon onClick={handleLike} title="Like">
            {liked
              ? <AiFillHeart style={{ color: "#ed4956", fontSize: 22 }} />
              : <AiOutlineHeart style={{ fontSize: 22 }} />}
          </ActionIcon>
          {/* Comment */}
          <ActionIcon onClick={() => setShowInput((v) => !v)} title="Comment">
            <FiMessageCircle style={{ fontSize: 21 }} />
          </ActionIcon>
          {/* Share */}
          <ActionIcon title="Share">
            <FiSend style={{ fontSize: 20 }} />
          </ActionIcon>
        </div>
        {/* Save */}
        <ActionIcon onClick={() => setSaved((v) => !v)} title="Save">
          {saved
            ? <BsBookmarkFill style={{ fontSize: 19, color: "#f0f0f0" }} />
            : <FiBookmark style={{ fontSize: 19 }} />}
        </ActionIcon>
      </div>

      {/* ── Comments ── */}
      {post.comments && post.comments.length > 0 && (
        <div style={{ padding: "0 14px 10px" }}>
          {post.comments.map((c) => (
             <div key={c._id} style={{ marginBottom: 4, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 600, color: "#ececec", marginRight: 6, fontSize: 13 }}>{c.user?.username || "user"}</span>
                <span style={{ fontSize: 13, color: "#aaa" }}>{c.text}</span>
             </div>
          ))}
        </div>
      )}

      {/* ── Comment input ── */}
      {showInput && (
        <form
          onSubmit={submitComment}
          style={{
            borderTop: "1px solid #141414",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Add a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              flex: 1,
              height: 42,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e0e0e0",
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              padding: "0 14px",
            }}
          />
          <button type="button" style={{ ...iconBtn, marginRight: 2 }}>
            <BsEmojiSmile style={{ fontSize: 15, color: "#444" }} />
          </button>
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            style={{
              ...iconBtn,
              color: comment.trim() ? "#0095f6" : "#2e2e2e",
              fontWeight: 600,
              fontSize: 13,
              paddingRight: 14,
              cursor: comment.trim() ? "pointer" : "default",
            }}
          >
            {submitting ? "…" : "Post"}
          </button>
        </form>
      )}
    </article>
  );
}

function ActionIcon({ children, onClick, title }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "none",
        border: "none",
        color: hov ? "#f0f0f0" : "#555",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.15s, transform 0.15s",
        transform: hov ? "scale(1.12)" : "scale(1)",
      }}
    >
      {children}
    </button>
  );
}

const iconBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
};

function formatAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
