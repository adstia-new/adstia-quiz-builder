export const getLeadIdTokenValue = () => {
  const leadIdElement = document.getElementById('leadid_token');

  return leadIdElement ? leadIdElement.value : '';
};
