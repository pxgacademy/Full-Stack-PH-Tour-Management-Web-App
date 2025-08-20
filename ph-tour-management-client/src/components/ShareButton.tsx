import { useState } from "react";
import { Button } from "./ui/button";

interface iProps {
  url?: string;
  className?: string;
  variant?: "link" | "default" | "outline" | "secondary" | "ghost";
  size?: "sm" | "xs" | "lg" | "icon" | "default";
}

export default function ShareButton({
  url,
  className = "",
  variant = "outline",
  size = "default",
}: iProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const pageUrl = window.location.href;

    if (navigator.share) {
      // Web Share API (Mobile + modern browsers)
      try {
        await navigator.share({
          title: document.title,
          text: "Check out this page!",
          url: url || pageUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(pageUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <Button onClick={handleShare} size={size} variant={variant} className={className}>
      {copied ? "Copied ✅" : "Share 🔗"}
    </Button>
  );
}
