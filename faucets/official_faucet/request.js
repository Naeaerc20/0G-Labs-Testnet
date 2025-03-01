const colors = require('colors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const pLimit = require('p-limit');
const { requestFaucet } = require('./scripts/apis');
const { TX_EXPLORER } = require('../../scripts/chain');
const wallets = require('../../scripts/wallets.json');

const proxiesPath = path.join(__dirname, '../../proxies.txt');
const proxiesContent = fs.readFileSync(proxiesPath, 'utf8');
const proxies = proxiesContent
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

function getProxyId(proxyLine) {
  try {
    const partAfter = proxyLine.split('-zone-custom-session-')[1];
    return partAfter.split('-sessTime')[0];
  } catch {
    return 'No ID Found';
  }
}

function getCaptchaToken(fullProxy) {
  return new Promise((resolve, reject) => {
    const captchaPath = path.join(__dirname, '../../scripts/captcha.js');
    const child = spawn('node', [captchaPath, fullProxy]);
    let token = null;
    child.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach((line) => {
        if (line.startsWith('CAPTCHA_SOLUTION=')) {
          token = line.split('=')[1].trim();
        } else if (line.trim().length > 0 && !line.startsWith('CAPTCHA_SOLUTION=')) {
          console.log(line.blue);
        }
      });
    });
    child.stderr.on('data', (data) => {
      console.error(data.toString().red);
    });
    child.on('close', (code) => {
      if (code === 0) {
        // Instead of printing the long token, we already printed "Captcha Solved!" in captcha.js.
        resolve(token);
      } else {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });
  });
}

async function processWallet(wallet) {
  const fullProxy = proxies[wallet.id - 1] || 'No Proxy Found';
  const proxyId = fullProxy === 'No Proxy Found' ? 'No ID Found' : getProxyId(fullProxy);
  console.log(`🔗 Using Proxy ID - [${proxyId}]`.blue);
  console.log(`⏳ Requesting Faucet for Wallet - [${wallet.address}]`.blue);
  const captchaToken = await getCaptchaToken(fullProxy);
  if (!captchaToken) {
    console.log(`❌ Could not solve captcha for [${wallet.address}]`.blue);
    return;
  }
  const message = await requestFaucet(wallet.address, captchaToken);
  if (message) {
    console.log(`✅ Faucet Request sent! - [${TX_EXPLORER}${message}]`.blue);
  } else {
    console.log(`❌ Faucet request failed for [${wallet.address}]`.blue);
  }
}

async function main() {
  const limit = pLimit(1);
  await Promise.all(wallets.map(wallet => limit(() => processWallet(wallet))));
}

main();
