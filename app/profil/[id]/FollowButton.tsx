"use client";

import { useState } from "react";
import { toggleFollow } from "@/actions/social";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

export function FollowButton({ targetUserId, initialIsFollowing }: { targetUserId: string, initialIsFollowing: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    const result = await toggleFollow(targetUserId);
    setLoading(false);
    
    if (result.error) {
      alert(result.error);
    } else {
      setIsFollowing(result.isFollowing!);
    }
  };

  return (
    <button 
      onClick={handleFollow}
      disabled={loading}
      className={`admin-btn-${isFollowing ? 'secondary' : 'primary'}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
      {isFollowing ? "Kikövetés" : "Követés"}
    </button>
  );
}
