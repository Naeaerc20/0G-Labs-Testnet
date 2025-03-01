const fs = require('fs');
const ethers = require('ethers');
const inquirer = require('inquirer');
const path = require('path');

const walletPath = path.join(__dirname, 'wallets.json');

const loadWallets = () => {
  if (!fs.existsSync(walletPath)) {
    fs.writeFileSync(walletPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
};

const saveWallets = (wallets) => {
  fs.writeFileSync(walletPath, JSON.stringify(wallets, null, 2));
};

const generateWallets = async () => {
  const { count } = await inquirer.prompt([
    {
      type: 'number',
      name: 'count',
      message: '💰 How many wallets do you want to generate?',
      validate: value => value > 0 ? true : 'Please enter a positive number'
    }
  ]);

  const wallets = loadWallets();
  const startId = wallets.length + 1;

  for (let i = 0; i < count; i++) {
    const wallet = ethers.Wallet.createRandom();
    const id = startId + i;
    wallets.push({
      id: id,
      address: wallet.address,
      privateKey: wallet.privateKey
    });
  }

  saveWallets(wallets);
  console.log(`✅ ${count} wallets have been generated and saved to wallets.json`);
};

generateWallets();
