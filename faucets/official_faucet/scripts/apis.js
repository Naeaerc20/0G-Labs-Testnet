// faucets/official_faucet/scripts/apis.js

const axios = require('axios');
const { TX_EXPLORER } = require('../../../scripts/chain');

async function requestFaucet(address, hcaptchaToken) {
  const apiUrl = 'https://992dkn4ph6.execute-api.us-west-1.amazonaws.com/';
  const payload = { address, hcaptchaToken };
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };

  try {
    const response = await axios.post(apiUrl, payload, { headers });
    if (response.status === 200 && response.data && response.data.message) {
      return response.data.message;
    } else {
      console.log(`Unexpected response: ${JSON.stringify(response.data)}`.blue);
    }
  } catch (error) {
    console.log(`Error in requestFaucet: ${error.message}`.blue);
  }
  return null;
}

module.exports = { requestFaucet };
