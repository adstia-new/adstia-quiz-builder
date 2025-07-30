export const sortAndRemoveDuplicate = (arr) => {
  const newArr = [...new Set(arr)];

  return newArr.sort();
};
