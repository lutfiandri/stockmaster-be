const calculatePoints = (timeSeconds) => {
  const points = Math.floor((100 / Math.sqrt(16 + timeSeconds)) * 4 + 50);
  return points;
};

module.exports = {
  calculatePoints,
};
