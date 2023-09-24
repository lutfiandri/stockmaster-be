const axios = require('axios');

const patterns = [
  'head-and-shoulders',
  'inverse-head-and-shoulders',
  'double-top',
  'double-bottom',
  'bearish-flag',
  'bullish-flag',
  'cup-and-handle',
  'inverse-cup-and-handle',
  'bullish-pennant',
  'bearish-pennant',
  'rising-wedge',
  'falling-wedge',
  'bullish-rectangle',
  'bearish-rectangle',
];

patterns.forEach(async (pattern) => {
  await axios
    .get(`http://localhost:5000/questions?pattern=${pattern}`)
    .then((res) => {
      const data = res.data.data;
      const ids = data?.map((d) => d._id);
      console.log(pattern);
      console.log(JSON.stringify(ids));
      console.log();
    });
});
