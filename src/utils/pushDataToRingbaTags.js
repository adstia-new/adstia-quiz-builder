export const pushDataToRingbaTags = (data) => {
  try {
    const entries = Object.entries(data);
    window._rgba_tags = window._rgba_tags || [];

    entries.forEach((i) => {
      window._rgba_tags.push({ [i[0]]: i[1] });
    });
  } catch (err) {
    console.log("Error pushing data to Ringba tags:", err);
  }
};
