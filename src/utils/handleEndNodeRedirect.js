import { replaceShortcodes } from "./replaceShortcodes";

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
      window.open(
        replaceShortcodes(`${endNode.redirectUrl}?${searchParams}`),
        "_blank"
      );
    }
    // Redirect current tab
    if (endNode.redirectCurrentTab && endNode.redirectCurrentTabUrl) {
      window.location.href = replaceShortcodes(
        `${endNode.redirectCurrentTabUrl}?${searchParams}`
      );
    } else if (endNode.redirectUrl && !endNode.openInNewTab) {
      window.location.href = replaceShortcodes(
        `${endNode.redirectUrl}?${searchParams}`
      );
    }
  }
}
