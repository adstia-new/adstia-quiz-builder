const getQuizValues = () => {
  try {
    const existingValues = localStorage.getItem('quizValues');
    return existingValues ? JSON.parse(existingValues) : {};
  } catch (error) {
    console.warn('Error parsing quizValues from localStorage:', error);
    return {};
  }
};

const saveQuizValues = (key, value) => {
  const quizValues = getQuizValues();
  quizValues[key] = value;
  localStorage.setItem('quizValues', JSON.stringify(quizValues));
};

module.exports = {
  getQuizValues,
  saveQuizValues,
};
