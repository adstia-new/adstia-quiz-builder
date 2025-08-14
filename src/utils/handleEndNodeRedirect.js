// Utility to handle end node redirect logic
export function handleEndNodeRedirect(quizJson, currentSlide, next) {
  if (typeof window === "undefined" || !window.location) return null;
  const searchParams = new URLSearchParams(window.location.search);

  const currentNode = quizJson.find(
    (element) => element.quizCardId === String(currentSlide)
  );

  const findNextSlideId = next || currentNode?.next;
  const nextSlideData =
    quizJson.find(
      (element) => element.quizCardId === String(findNextSlideId)
    ) || {};

  const endNode = nextSlideData.nodes?.[0];

  if (endNode) {
    // Open new tab immediately if needed
    if (endNode.openInNewTab && endNode.redirectUrl) {
      let url = `${endNode.redirectUrl}?${searchParams}`;

      if (
        typeof window !== "undefined" &&
        typeof window?.adstiaScripts?.replaceShortcodes === "function"
      ) {
        url = window?.adstiaScripts?.replaceShortcodes(url);
      }

      window.open(url, "_blank");
    }
    // Redirect current tab
    if (endNode.redirectCurrentTab && endNode.redirectCurrentTabUrl) {
      let url = `${endNode.redirectCurrentTabUrl}?${searchParams}`;

      if (
        typeof window !== "undefined" &&
        typeof window?.adstiaScripts?.replaceShortcodes === "function"
      ) {
        url = window?.adstiaScripts?.replaceShortcodes(url);
      }

      window.location.href = url;
    } else if (endNode.redirectUrl && !endNode.openInNewTab) {
      let url = `${endNode.redirectUrl}?${searchParams}`;

      if (
        typeof window !== "undefined" &&
        typeof window?.adstiaScripts?.replaceShortcodes === "function"
      ) {
        url = window?.adstiaScripts?.replaceShortcodes(url);
      }

      window.location.href = url;
    }
  }
}
