export const getLeadIdTokenValue = () => {
  if (typeof window === 'undefined') return null;

  const storedLeadId = localStorage.getItem('leadId');

  if (storedLeadId) {
    return storedLeadId;
  }

  const leadIdElement = document.getElementById('leadid_token');

  if (leadIdElement && leadIdElement.value) {
    localStorage.setItem('leadId', leadIdElement.value);
  }

  return leadIdElement ? leadIdElement.value : '';
};
