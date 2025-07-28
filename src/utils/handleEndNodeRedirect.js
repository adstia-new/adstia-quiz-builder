// Utility to handle end node redirect logic
export function handleEndNodeRedirect(quizJson, currentSlide) {
  const currentNode = quizJson.find(
    (element) => element.quizCardId === String(currentSlide)
  );
  const findNextSlideId = currentNode?.next;
  const nextSlideData =
    quizJson.find(
      (element) => element.quizCardId === String(findNextSlideId)
    ) || {};
  const endNode = nextSlideData.nodes?.[0];
  if (endNode) {
    // Open new tab immediately if needed
    if (endNode.openInNewTab && endNode.redirectUrl) {
      window.open(endNode.redirectUrl, "_blank");
    }
    // Redirect current tab
    if (endNode.redirectCurrentTab && endNode.redirectCurrentTabUrl) {
      window.location.href = endNode.redirectCurrentTabUrl;
    } else if (endNode.redirectUrl && !endNode.openInNewTab) {
      window.location.href = endNode.redirectUrl;
    }
  }
}
