// Utility to append LeadId script to head
export function appendLeadIdScript(leadId) {
  if (!leadId) return () => {};
  const script = document.createElement("script");
  script.id = "LeadIdscript_campaign";
  script.type = "text/javascript";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `//create.lidstatic.com/campaign/${leadId}.js`;
  document.head.appendChild(script);
  return () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
}
