"use client";

function getInitials(name: string): string {
  if (!name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface ClientAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-9 h-9 text-[11px]",
  lg: "w-11 h-11 text-xs",
};

export default function ClientAvatar({ name, size = "md" }: ClientAvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={`${SIZES[size]} rounded-lg bg-bg-tertiary border border-border flex items-center justify-center font-semibold text-text-muted shrink-0`}
    >
      {initials}
    </div>
  );
}
