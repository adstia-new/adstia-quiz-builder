const clarity = function () {
  if (typeof window === 'undefined') return;
  try {
    window.clarity =
      window.clarity ||
      function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
    window.clarity.apply(null, arguments);
  } catch (e) {}
};

export const clarityEvent = (name) => {
  if (!name) return;
  clarity('event', name);
};

export const clarityStepView = (prefix, stepId) => {
  const step = String(stepId === undefined || stepId === null ? '' : stepId).replace(
    /[^a-zA-Z0-9_]/g,
    ''
  );
  if (!step) return;
  clarityEvent(`${prefix}_step${step}_view`);
};
