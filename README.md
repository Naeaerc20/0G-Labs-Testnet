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
