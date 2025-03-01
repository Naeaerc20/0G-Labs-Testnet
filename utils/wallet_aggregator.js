const fs = require('fs');
const inquirer = require('inquirer');
const ethers = require('ethers');

const loadWallets = () => {
  if (!fs.existsSync('wallets.json')) {
    fs.writeFileSync('wallets.json', JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync('wallets.json', 'utf-8'));
};

const saveWallets = (wallets) => {
  fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2));
};

const aggregateWallets = async () => {
  const wallets = loadWallets();
  let nextId = wallets.length > 0 ? wallets[wallets.length - 1].id + 1 : 1;
  let continueAdding = true;

  while (continueAdding) {
    const { privateKey } = await inquirer.prompt([
      {
        type: 'input',
        name: 'privateKey',
        message: `🔑 Please enter the private key for wallet ${nextId}:`
      }
    ]);

    try {
      const walletInstance = new ethers.Wallet(privateKey);
      const address = walletInstance.address;

      wallets.push({
        id: nextId,
        address,
        privateKey
      });

      console.log(`✅ Wallet added: ID ${nextId} - Address: ${address}`);
      nextId++;
    } catch (error) {
      console.log("❌ Error: Invalid private key. Please try again.");
    }

    const { addAnother } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addAnother',
        message: '➕ Do you want to add another wallet?',
        default: false
      }
    ]);

    continueAdding = addAnother;
  }

  saveWallets(wallets);
  console.log("💾 Wallets have been aggregated and saved to wallets.json");
};

aggregateWallets();
