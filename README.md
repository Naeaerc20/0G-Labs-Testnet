## 0G-Labs-Testnet

Welcome to 0G Testnet - this script will contain a couple files/scripts to manage various actions in 0G testnet such as swaps
contract deployment, token launch, liquidity etc... Current project structure is;

``` bash

0G-Labs-Testnet/
├── actions/                  
│   └── (empty)              # Reserved for future action scripts
│
├── faucets/
│   └── official_faucet/
│       ├── request.js       # Handles faucet requests
│       ├── captcha.js       # Manages captcha verification
│       ├── scripts/         # Contains additional faucet-related scripts
│       └── apis.js          # Manages API calls for the faucet service
│
├── index.js                 # Main entry point of the project
├── node_modules/            # Contains npm packages and dependencies
├── package.json             # Project metadata, dependencies, and scripts configuration
├── package-lock.json        # Locks the dependency versions for consistency
├── proxies.txt              # Lists proxy configuration details
├── README.md                # Provides project overview, installation, and usage instructions
│
└── utils/
    ├── chain.js             # Handles blockchain interactions and chain-related functions
    ├── wallet_aggregator.js # Aggregates operations or data across multiple wallets
    ├── wallet_generator.js  # Generates wallet addresses or credentials
    └── wallets.json         # Stores wallet data in JSON format

Files will be fully updated shortly.


## Instructions

1. git clone https://github.com/Naeaerc20/0G-Labs-Testnet
2. cd 0G-Labs-Testnet
3. Run any of following prompts to interact with the code

- npm start - starts the main applicacion index.js
- npm run add - runs utils/wallet_aggregator.js - allowing you to add existing addresses
- npm run create - runs utils/wallet_generator.js -  allowing you to generate new addresses
- npm run show - runs cat utils/wallets.json - showing you current wallets added in the code

## Notes

1. Generate your own proxies from 2CAPTCHA in format socks5://login:pass@ip:port - then paste them on proxies.txt
2. Get your ACCESS_TOKEN by registering an account in "https://bestcaptchasolver.com/account" then place it using "nano faucets/official_faucet/captcha.js"
