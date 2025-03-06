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
      console.log(`Faucet Request Failed with code - [${response.status}] API Response: ${JSON.stringify(response.data)}`);
      throw new Error("Unexpected response");
    }
  } catch (error) {
    const code = error.response && error.response.status ? error.response.status : 'unknown';
    const data = error.response && error.response.data ? error.response.data : { error: error.message };
    console.log(`Faucet Request Failed with code - [${code}] API Response: ${JSON.stringify(data)}`);
    throw error;
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
