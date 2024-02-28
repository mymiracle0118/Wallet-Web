# frontend-web-wallet-extension

## CONTENTS OF THIS FILE

- Introduction
- Installation
- Starting storybook
  - starting extension storybook
  - Starting mobile storybook
- Running extension locally
- Deploying
- Repository structure
- Testing Transactions

## INTRODUCTION

[Shuttle Wallet Documentation.](https://supra-oracles.atlassian.net/wiki/spaces/ECOSYSTEM/pages/90079233/Shuttle+Wallet+Documentation)

## INSTALLATION EXTENSTION DEPENDENCIES

> if you don't have yarn installed

```
npm install --global yarn
```

```
yarn
```

## STARTING EXTENSION'S STORYBOOK

```
yarn storybook
```

## RUNNING EXTENSION LOCALLY

> build the extension

```
yarn build
```

> add it to your browser
> ![Alt Text](extension.gif)

## DEPLOYING TO VERCEL

> Deploying is automated for both storybook and the extension

## Repository structure

```
|- Shuttle Extension
  |- UI Components
	|- Rest of folders
|- Mobile
	|- UI Components
	|- Rest of folders
|- Shared
  |- UI
    |- Colors and fonts and other theme configuration for light and dark theme
  |- Services
|- Extension - Build file. Git ignored
|- storybook-static - Build file. Git ignored
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

https://goerli.etherscan.io/address/0x63c100ac0c36549c7218070294b60c18d813675c
