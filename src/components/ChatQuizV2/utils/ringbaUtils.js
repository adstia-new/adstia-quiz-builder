export const addRingbaScript = (ringbaScriptId) => {
  const existingScript = document.getElementById('ringba-script-med');
  if (existingScript) {
    return;
  }

  if (!ringbaScriptId) {
    console.error('Ringba script ID is required');
    return;
  }

  const script = document.createElement('script');
  script.id = 'ringba-script-med';
  script.src = `//b-js.ringba.com/${ringbaScriptId}`;
  script.async = true;

  document.head.appendChild(script);
};
