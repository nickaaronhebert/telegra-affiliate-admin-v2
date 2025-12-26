/**
 * Creates a MutationObserver to watch for changes in the DOM
 * @param selector - CSS selector for the element to observe
 * @param callback - Callback function to execute when mutations are detected
 * @returns MutationObserver instance or null if element not found
 */
export const createObserver = (
  selector: string,
  callback: () => void
): MutationObserver | null => {
  const element = document.querySelector(selector);

  if (!element) {
    console.warn(`Element with selector "${selector}" not found`);
    return null;
  }

  const observer = new MutationObserver(() => {
    callback();
  });

  observer.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return observer;
};

export default createObserver;
