export const getESTISOString = () => {
  const date = new Date();

  const estDate = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const parts = {};
  estDate.forEach(({ type, value }) => {
    parts[type] = value;
  });

  const formatted = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`;
  return formatted;
};
