const colors = require('colors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const inquirer = require('inquirer');
const { requestFaucet, getProxyIP } = require('./scripts/apis');
const { TX_EXPLORER } = require('../../utils/chain');
const wallets = require('../../utils/wallets.json');

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
    const captchaPath = path.join(__dirname, './captcha.js');
    const child = spawn('node', [captchaPath, fullProxy]);
    let token = null;
    child.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach((line) => {
        if (line.startsWith('CAPTCHA_SOLUTION=')) {
          token = line.split('=')[1].trim();
        } else if (line.startsWith('🔑 response:')) {
          // Do not print the raw captcha solution line
        } else if (line.trim().length > 0) {
          // Print only status messages from captcha.js
          if (
            line.includes('Solving hCaptcha') ||
            line.includes('Balance:') ||
            line.includes('Got ID')
          ) {
            console.log(line.blue);
          }
        }
      });
    });
    child.stderr.on('data', (data) => {
      console.error(data.toString().red);
    });
    child.on('close', (code) => {
      if (code === 0) {
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
  const publicIP = fullProxy === 'No Proxy Found' ? 'No IP Found' : await getProxyIP(fullProxy);
  console.log(`🔗 Using Proxy ID - [${proxyId}] with Public IP - [${publicIP}]`.blue);
  console.log('⏳ Solving Captcha...'.blue);
  let captchaToken;
  try {
    captchaToken = await getCaptchaToken(fullProxy);
  } catch (err) {
    console.log(`❌ Error solving captcha: ${err.message}\n`.red);
    return;
  }
  if (!captchaToken) {
    console.log(`❌ Captcha not solved for wallet [${wallet.address}]\n`.red);
    return;
  }
  console.log('✅ Captcha Solved!'.blue);
  console.log(`🔐 Requesting Faucet for Wallet - [${wallet.address}]`.blue);
  try {
    const message = await requestFaucet(wallet.address, captchaToken);
    if (message) {
      console.log(`🎉 Faucet Successfully Claimed! - [${TX_EXPLORER}${message}]\n`.blue);
    } else {
      console.log(`❌ Faucet request failed for wallet [${wallet.address}]\n`.red);
    }
  } catch (error) {
    let code = error.response && error.response.status ? error.response.status : 'unknown';
    console.log(`❌ Faucet request failed for wallet [${wallet.address}]`.red);
    const data = error.response && error.response.data ? error.response.data : { error: error.message };
    console.log(`❌ API Response: ${JSON.stringify(data, null, 0)}`.red);
  }
}

async function main() {
  // Pregunta inicial para definir el modo de procesamiento
  const modeAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'claimMode',
      message: 'How would you like to process faucet claims?',
      choices: [
        { name: '1. Process one wallet per day', value: 'one' },
        { name: '2. Process all wallets sequentially immediately', value: 'all' }
      ]
    }
  ]);

  if (modeAnswer.claimMode === 'one') {
    for (const wallet of wallets) {
      await processWallet(wallet);
      console.log('\n⏳ Waiting 24 hours before next claim for next wallet...\n'.blue);
      await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000));
    }
  } else if (modeAnswer.claimMode === 'all') {
    // Procesa todas las wallets una tras otra sin esperar 24 horas entre cada una
    for (const wallet of wallets) {
      await processWallet(wallet);
    }
    console.log('\nCompleted sequential faucet claims for all wallets.\n'.blue);
    process.exit(0);
  }
}

main();
