# BABYLON - Private Prediction Markets for Companies

<div align="center">

![BABYLON](https://img.shields.io/badge/BABYLON-Prediction_Markets-dc2626?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENCE)
[![Built with Scaffold-ETH 2](https://img.shields.io/badge/Built%20with-Scaffold--ETH%202-blueviolet?style=for-the-badge)](https://scaffoldeth.io)

**A sleek, dark-themed decentralised private prediction markets platform built on Ethereum**

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Usage](#usage) • [Architecture](#architecture)

</div>

---

## 📋 Overview

BABYLON is a decentralised private prediction markets platform that enables small/medium business owners to create and resolve prediction markets for their employees on the Ethereum blockchain. With a modern dark UI featuring red accents, BABYLON provides an intuitive interface for even non-technicals to forecast future business events, far outcompeting traditional consultants and business forecasting without paying hand over fist. **More of the upside, less of the cost.**

## ✨ Features

### Core Functionality
- 🎯 **Create Markets** - Launch prediction markets with custom questions and end dates
- 💰 **Prize Pools** - Add ETH to markets as incentive prizes (bonus incentive for employees to provide good information to the market)
- 📊 **Real-time Probabilities** - Live probability calculations based on share distribution
- 🎲 **Binary Outcomes** - Trade YES/NO shares on market outcomes
- ⚡ **Instant Settlement** - Automated payout distribution to winners
- 🔐 **Oracle System** - Trusted market resolution by market creators

### User Experience
- 🌑 **Dark Theme** - Sleek dark interface with red accent colors
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 💳 **Wallet Integration** - Connect with MetaMask, WalletConnect, and more via RainbowKit
- 🔄 **Live Updates** - Real-time market data and position tracking
- 📈 **Position Dashboard** - Track your shares and potential payouts

### Developer Features
- 🔥 **Hot Reload** - Frontend auto-updates with smart contract changes
- 🧪 **Local Development** - Built-in Hardhat network for testing
- 🪝 **Custom Hooks** - React hooks for seamless contract interaction
- 🎨 **DaisyUI Components** - Pre-styled UI components
- 📦 **TypeScript** - Full type safety across the stack

## 🛠 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[DaisyUI](https://daisyui.com/)** - Component library
- **[RainbowKit](https://www.rainbowkit.com/)** - Wallet connection UI
- **[Wagmi](https://wagmi.sh/)** - React hooks for Ethereum
- **[Viem](https://viem.sh/)** - TypeScript Ethereum library

### Smart Contracts
- **[Solidity](https://soliditylang.org/)** - Smart contract language
- **[Hardhat](https://hardhat.org/)** - Development environment
- **[OpenZeppelin](https://www.openzeppelin.com/)** - Security standards

### Development Tools
- **[Scaffold-ETH 2](https://scaffoldeth.io)** - Rapid dApp development
- **[Yarn](https://yarnpkg.com/)** - Package management
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **[Node.js](https://nodejs.org/)** >= v20.18.3
- **[Yarn](https://yarnpkg.com/)** v1 or v2+
- **[Git](https://git-scm.com/)**
- **[MetaMask](https://metamask.io/)** or another Web3 wallet

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/babylon-prediction-markets.git
cd babylon-prediction-markets
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Start Local Blockchain

Open a terminal and run:

```bash
yarn chain
```

This starts a local Hardhat network. Keep this terminal running.

### 4. Deploy Smart Contracts

Open a second terminal and run:

```bash
yarn deploy
```

This deploys the `PredictionMarket` contract to your local network.

### 5. Start the Frontend

Open a third terminal and run:

```bash
yarn start
```

Visit **http://localhost:3000** to see BABYLON in action!

## 💡 Usage

### Creating a Market

1. Navigate to **Create Market**
2. Enter your prediction question (e.g., "Will ETH reach $5000 by Dec 2025?")
3. Set the end date for trading
4. Optionally add a prize pot in ETH
5. Select audience (demo feature: Executives, Tech, HR, Customers, All)
6. Click **Create Market**

### Trading Shares

1. Go to **My Markets** and select a market
2. View real-time probabilities for YES/NO outcomes
3. Choose YES or NO
4. Enter the number of shares (0.01 ETH per share)
5. Click **Buy Shares**
6. Confirm the transaction in your wallet

### Resolving Markets

As the market oracle (creator):

1. Wait until the market end date has passed
2. Open the market page
3. Click **Resolve as YES** or **Resolve as NO** based on the outcome
4. Confirm the resolution transaction

### Claiming Winnings

If you hold winning shares:

1. Open the resolved market
2. Click **Claim Payout**
3. Receive your proportional share of the prize pot plus your invested ETH

## 🏗 Architecture

### Smart Contract Structure

```
PredictionMarket.sol
├── Market Struct
│   ├── id
│   ├── oracle (creator)
│   ├── question
│   ├── endDate
│   ├── totalYesShares
│   ├── totalNoShares
│   ├── prizePot
│   ├── resolved
│   └── outcome
│
├── Core Functions
│   ├── createMarket()
│   ├── buyShares()
│   ├── resolveMarket()
│   └── claimPayout()
│
└── View Functions
    ├── getMarket()
    ├── getUserPosition()
    └── calculatePotentialPayout()
```

### Frontend Pages

```
app/
├── page.tsx              # Auto-redirects to markets
├── create/
│   └── page.tsx          # Create new markets
├── markets/
│   └── page.tsx          # Browse all markets (My Markets)
└── market/[id]/
    └── page.tsx          # Individual market details & trading
```

### Custom Hooks

- `useScaffoldReadContract` - Read blockchain data
- `useScaffoldWriteContract` - Execute transactions
- `useScaffoldEventHistory` - Listen to contract events

## 🧪 Development

### Running Tests

```bash
yarn hardhat:test
```

### Linting & Formatting

```bash
# Lint code
yarn lint

# Format code
yarn format
```

### Building for Production

```bash
yarn next:build
```

### Deploying to Testnet

1. Update `packages/nextjs/scaffold.config.ts` with your target network
2. Add network config in `packages/hardhat/hardhat.config.ts`
3. Set your private key:

```bash
yarn account:import
```

4. Deploy:

```bash
yarn deploy --network sepolia
```

### Deploying Frontend

```bash
yarn vercel:yolo --prod
```

## 📊 Smart Contract Details

### Market Creation

- Markets require a future end date
- Creators become the oracle (resolution authority)
- Optional prize pot can be added during creation

### Share Pricing

- Fixed price: **0.01 ETH per share**
- Linear pricing model (no bonding curve)
- Separate pools for YES and NO shares

### Payout Calculation

For winning shares:

```
userPayout = (userShares / totalWinningShares) * totalPool
```

Where `totalPool = (totalYesShares + totalNoShares) * 0.01 ETH + prizePot`

## 🔐 Security Considerations

- Market creators are trusted oracles (centralized resolution)
- No automated dispute resolution mechanism
- Fixed share price prevents market manipulation via pricing
- Payouts can only be claimed once per user per market
- Markets can only be resolved by the original creator
- Resolution only allowed after end date

## 🌐 Network Support

Currently configured for:
- **Local Development** - Hardhat Network
- **Testnet** - Sepolia (configurable)
- **Mainnet** - Support can be added via config

## 📝 Environment Variables

Create `.env.local` in `packages/nextjs/`:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wc_project_id
```

## 🤝 Contributing

Contributions are welcome! Please check [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENCE](./LICENCE) file for details.

## 🙏 Acknowledgments

- Built with [Scaffold-ETH 2](https://scaffoldeth.io)
- Developed for ETH Oxford Hackathon
- Inspired by prediction market platforms like Polymarket and Augur

## 📧 Contact & Support

- **Issues** - [GitHub Issues](https://github.com/YOUR_USERNAME/babylon-prediction-markets/issues)
- **Discussions** - [GitHub Discussions](https://github.com/YOUR_USERNAME/babylon-prediction-markets/discussions)

---

<div align="center">

**Built with ❤️ using Scaffold-ETH 2**

[⬆ back to top](#babylon---decentralized-prediction-markets)

</div>
