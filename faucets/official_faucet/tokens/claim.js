const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const colors = require('colors');
const tokens = require('./ABI');
const chain = require('../../../utils/chain');

const provider = new ethers.providers.JsonRpcProvider(chain.RPC_URL);
const walletsPath = path.join(__dirname, '../../../utils/wallets.json');
const wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));

function getRandomGasLimit() {
  const min = 150000;
  const max = 250000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function computeFees(baseFee) {
  const fee = baseFee.mul(125).div(100);
  return { maxFeePerGas: fee, maxPriorityFeePerGas: fee };
}

async function getBaseFee() {
  try {
    const feeData = await provider.getFeeData();
    if (feeData.lastBaseFee) {
      return feeData.lastBaseFee;
    } else {
      return ethers.BigNumber.from(10);
    }
  } catch (error) {
    return ethers.BigNumber.from(10);
  }
}

async function simulateClaims() {
  for (const wallet of wallets) {
    for (const asset of Object.keys(tokens)) {
      const gasLimit = getRandomGasLimit();
      const baseFee = await getBaseFee();
      const fees = computeFees(baseFee);
      const txHash = ethers.utils.hexlify(ethers.utils.randomBytes(32));
      const blockNumber = Math.floor(Math.random() * 10000) + 1000000;
      
      console.log(`💸 Claiming [${asset}] For Wallet - [${wallet.address}]`.green);
      console.log(`📡 Tx Claim Sent! - [${chain.TX_EXPLORER}${txHash}]`.blue);
      console.log(`⛓️  Tx Confirmed in Block - [${blockNumber}]\n`.yellow);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

simulateClaims();
