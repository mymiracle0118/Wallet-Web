# Star Key Web Wallet Extension

## CONTENTS OF THIS FILE

- Installation
- Running extension locally
- Deploying
- Repository structure
- Testing Transactions

## INSTALLATION EXTENSTION DEPENDENCIES

> if you don't have yarn installed

```
npm install --global yarn
```

```
yarn
```

> Copy `.env.development` to `.env` in portal-extension

## RUNNING EXTENSION LOCALLY

> build the extension
```
yarn build
```

> Add it to your browser
> ![Alt Text](extension.gif)

## DEPLOYING TO VERCEL

> Deploying is automated for the extension

## Repository structure

```
|- Star Key Wallet Extension
  |- UI Components
  |- Rest of folders
|- Shared
  |- Factory
    |- Helpers
    |- Network factory to call services depends on current network
  |- Hooks
    |- All storage hooks
  |- Services
    |- All network services and common services
|- Extension - Build file. Git ignored
```

## TESTING TRANSACTIONS

1. Go to Import wallet or restore wallet
2. Paste the following seed phrase that has preloaded asset balances:

```
oven cigar apology become okay nice soldier right situate trend runway baby
```

3. Enter a password for imported wallet
4. You should now be able to view balances and send assets from the wallet

You can view transactions from this wallet using the etherscan link below to verify everything has worked

https://sepolia.etherscan.io/address/0x63c100ac0c36549c7218070294b60c18d813675c
