"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Button from "./Button";

const SubscribeButton = ({ targetUserId, onSubscriptionChange }) => {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!session?.user || !targetUserId) return;
      try {
        const res = await fetch(
          `/api/users/subscribe?targetUserId=${targetUserId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setIsSubscribed(data.isSubscribed);
      } catch (err) {
        console.error("Check subscription error:", err);
      }
    };
    checkSubscription();
  }, [session, targetUserId]);

  if (!targetUserId) {
    console.error("targetUserId is undefined");
    return;
  }
  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      if (!res.ok) {
        console.error("Subscription request failed");
        return;
      }
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);

      if (onSubscriptionChange) {
        onSubscriptionChange(data.isSubscribed ? 1 : -1);
      }
    } catch (err) {
      console.error("Subscribe error", err);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user || session.user.id === targetUserId) return null;

  return (
    <div className="mt-4">
      <Button onClick={handleClick} disabled={loading}>
        {loading
          ? "Завантаження..."
          : isSubscribed
          ? "Відписатися"
          : "Підписатися"}
      </Button>
    </div>
  );
};

export default SubscribeButton;
