interface UserAvatarProps {
  name?: string | null
  image?: string | null
  size?: "sm" | "md"
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("")
}

export function UserAvatar({ name, image, size = "sm" }: UserAvatarProps) {
  const sizeClass = size === "md" ? "w-8 h-8 text-sm" : "w-7 h-7 text-xs"

  if (image) {
    return (
      <img
        src={image}
        alt={name ?? "User avatar"}
        className={`${sizeClass} rounded-full object-cover shrink-0`}
        referrerPolicy="no-referrer"
      />
    )
  }

  const initials = name ? getInitials(name) : "?"

  return (
    <div
      className={`${sizeClass} rounded-full bg-primary flex items-center justify-center font-medium text-primary-foreground shrink-0`}
    >
      {initials}
    </div>
  )
}
