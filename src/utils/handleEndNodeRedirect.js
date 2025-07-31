// Utility to handle end node redirect logic
export function handleEndNodeRedirect(quizJson, currentSlide, isOptionsQuiz) {
  const searchParams = new URLSearchParams(window.location.search);

  const currentNode = quizJson.find(
    (element) => element.quizCardId === String(currentSlide)
  );

  if (isOptionsQuiz) {
    if (
      currentNode?.nodes?.[0]?.openInNewTab &&
      currentNode?.nodes?.[0]?.redirectUrl
    ) {
      window.open(
        `${currentNode?.nodes?.[0]?.redirectUrl}?${searchParams}`,
        "_blank"
      );
    }
    // Redirect current tab
    if (
      currentNode?.nodes?.[0]?.redirectCurrentTab &&
      currentNode?.nodes?.[0]?.redirectCurrentTabUrl
    ) {
      window.location.href = `${currentNode?.nodes?.[0]?.redirectCurrentTabUrl}?${searchParams}`;
    } else if (
      currentNode?.nodes?.[0]?.redirectUrl &&
      !currentNode?.nodes?.[0]?.openInNewTab
    ) {
      window.location.href = `${currentNode?.nodes?.[0]?.redirectUrl}?${searchParams}`;
    }
    return;
  }

  // Handle end node redirect logic for non-options quizzes
  const findNextSlideId = currentNode?.next;
  const nextSlideData =
    quizJson.find(
      (element) => element.quizCardId === String(findNextSlideId)
    ) || {};

  const endNode = nextSlideData.nodes?.[0];
  if (endNode) {
    // Open new tab immediately if needed
    if (endNode.openInNewTab && endNode.redirectUrl) {
      window.open(`${endNode.redirectUrl}?${searchParams}`, "_blank");
    }
    // Redirect current tab
    if (endNode.redirectCurrentTab && endNode.redirectCurrentTabUrl) {
      window.location.href = `${endNode.redirectCurrentTabUrl}?${searchParams}`;
    } else if (endNode.redirectUrl && !endNode.openInNewTab) {
      window.location.href = `${endNode.redirectUrl}?${searchParams}`;
    }
  }
}
