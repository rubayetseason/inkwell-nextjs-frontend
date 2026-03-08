export function getAvatarFallback(username: string) {
  return username?.slice(0, 2).toUpperCase() || "U";
}
