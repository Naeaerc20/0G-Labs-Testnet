const axios = require('axios');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { TX_EXPLORER } = require('../../../utils/chain');

async function requestFaucet(address, hcaptchaToken) {
  const apiUrl = 'https://992dkn4ph6.execute-api.us-west-1.amazonaws.com/';
  const payload = { address, hcaptchaToken, token: "A0GI" };
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };

  try {
    const response = await axios.post(apiUrl, payload, { headers });
    if (response.status === 200 && response.data && response.data.message) {
      return response.data.message;
    } else {
      console.log(`Unexpected response: ${JSON.stringify(response.data)}`.blue);
      return null;
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw error;
    } else {
      console.log(`Error in requestFaucet: ${error.message}`.blue);
      return null;
    }
  }
}

async function getProxyIP(proxy) {
  try {
    const agent = new SocksProxyAgent(proxy);
    const response = await axios.get('https://api.ipify.org?format=json', {
      httpAgent: agent,
      httpsAgent: agent,
      timeout: 15000
    });
    return response.data.ip;
  } catch (error) {
    console.log(`Error in getProxyIP: ${error.message}`.red);
    return null;
  }
}

module.exports = { requestFaucet, getProxyIP };
