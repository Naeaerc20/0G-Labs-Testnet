// index.js

const inquirer = require('inquirer');
const figlet = require('figlet');
const colors = require('colors');
const clear = require('console-clear');
const { spawn } = require('child_process');

function showBanner() {
  clear();
  const banner = figlet.textSync('0G Labs', { font: 'Standard' });
  console.log(banner.green);
  console.log('Script created by Naeaex'.green);
  console.log('Follow me on X - x.com/naeaexeth or Github - github.com/Naeaerc20'.green);
}

async function mainMenu() {
  showBanner();
  const { option } = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Select an option:',
      choices: [
        { name: '1. Claim Faucet', value: 'claim_faucet' },
        { name: '2. Executer Swaps (coming soon...)', value: 'executer_swaps' },
        { name: '3. Manage LP (coming soon...)', value: 'manage_lp' },
        { name: '4. Deploy Contracts (coming soon...)', value: 'deploy_contracts' },
        { name: '5. Deploy a Token (coming soon...)', value: 'deploy_token' },
        { name: '6. Deploy an NFT collection (coming soon...)', value: 'deploy_nft' },
        { name: '0. Exit', value: 'exit' }
      ]
    }
  ]);

  switch (option) {
    case 'claim_faucet':
      await claimFaucetMenu();
      break;
    case 'exit':
      console.log('Exiting...');
      process.exit(0);
    default:
      console.log('Option coming soon...');
      await pause();
      break;
  }
  await mainMenu();
}

async function claimFaucetMenu() {
  const { faucetOption } = await inquirer.prompt([
    {
      type: 'list',
      name: 'faucetOption',
      message: 'Select a faucet:',
      choices: [
        { name: '1. Official Faucet', value: 'official' },
        { name: '2. Faucet.Trade (coming soon...)', value: 'trade' }
      ]
    }
  ]);

  if (faucetOption === 'official') {
    console.log('Official Faucet selected.\n');
    const { assetOption } = await inquirer.prompt([
      {
        type: 'list',
        name: 'assetOption',
        message: 'What assets would you like to claim?',
        choices: [
          { name: '1. A0GI', value: 'a0gi' },
          { name: '2. ETH, BTC, USDT', value: 'eth_btc_usdt' }
        ]
      }
    ]);

    if (assetOption === 'a0gi') {
      await spawnChildInteractive('node', ['faucets/official_faucet/request.js']);
    } else if (assetOption === 'eth_btc_usdt') {
      await spawnChildInteractive('node', ['faucets/official_faucet/tokens/claim.js']);
    }
    await backToMainMenu();
  } else {
    console.log('Faucet.Trade selected. (coming soon...)');
    await pause();
  }
}

function spawnChildInteractive(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });
  });
}

async function backToMainMenu() {
  await inquirer.prompt([
    { type: 'input', name: 'pause', message: 'Press ENTER to back main menu...' }
  ]);
  clear();
  await mainMenu();
}

async function pause() {
  await inquirer.prompt([{ type: 'input', name: 'pause', message: 'Press ENTER to continue...' }]);
}

mainMenu();
