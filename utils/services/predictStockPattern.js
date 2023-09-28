const axios = require('axios');
const { decode } = require('node-base64-image');
const getenv = require('../helpers/getenv');

const BE_ML_BASEURL = getenv('BE_ML_BASEURL');

const predictStockPattern = async (patternBase64) => {
  const data = {
    image: patternBase64,
  };

  const result = await axios.post(
    BE_ML_BASEURL + '/stock-pattern?image-type=b64',
    data
  );

  return result;
};

module.exports = { predictStockPattern };
