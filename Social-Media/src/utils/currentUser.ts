export function getCurrentUserId(): string | null {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.userId || payload.id || payload._id || payload.sub || payload.user?._id || null;
  } catch { return null; }
}
