/**
 * trackEvent — fire-and-forget click/view tracker.
 * Never throws, never blocks navigation.
 */
export function trackEvent(action: string): void {
  const payload = JSON.stringify({ action });
  // Use sendBeacon when available so it survives navigation
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/log", new Blob([payload], { type: "application/json" }));
  } else {
    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}
