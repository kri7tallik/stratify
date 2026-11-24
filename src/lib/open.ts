/** Opens a URL in the system browser (Tauri) or a new tab (web preview). */
export async function openExternal(url: string) {
  if (!url) return;
  if ("__TAURI_INTERNALS__" in window) {
    try {
      const { openUrl } = await import("@tauri-apps/plugin-opener");
      await openUrl(url);
      return;
    } catch (e) {
      console.warn("opener failed, falling back", e);
    }
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
