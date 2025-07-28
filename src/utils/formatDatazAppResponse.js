export const formatDatazAppResponse = (obj) => {
  const toSnakeCase = (str) =>
    str
      .replace(/([a-z])([A-Z])/g, "$1_$2") // camelCase to snake_case
      .replace(/[\s-]+/g, "_") // replace spaces or hyphens with _
      .toLowerCase();

  const transformed = {};

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const snakeKey = "datazapp_" + toSnakeCase(key);
      transformed[snakeKey] = obj[key];
    }
  }

  return transformed;
};
