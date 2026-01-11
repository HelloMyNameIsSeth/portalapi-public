# Portal API

A REST API for managing NFT-based raffle campaigns, wallet authentication, and token management. Built with NestJS, Prisma, and Ethereum integration.

> **Note:** This is a modified public version of a live client project, released for demonstration purposes. Proprietary business logic and sensitive data have been removed.

## Features

- **Wallet Authentication**: Secure Web3 wallet connection.
- **Raffle Management**: Manage campaigns, entries, and winners.
- **Token Integration**: Real-time NFT data from Ethereum.
- **Winner Selection**: Automated processing.

## Tech Stack

NestJS, Prisma, PostgreSQL, Ethereum/Web3, JWT, Fastify, Docker.

## Architecture

Key entities include **Wallet** (Users), **Raffle** (Campaigns), **Token** (NFTs), and **RaffleEntry**.

## Getting Started

### Prerequisites & Installation

Requires Node.js 14+, Docker, and PostgreSQL.

```bash
# Clone
git clone https://github.com/HelloMyNameIsSeth/portalapi-public.git
cd portalapi-public

# Install
yarn install

# Setup Env
cp .env.example .env

# Database
docker-compose up -d
yarn prisma migrate dev
yarn db:seed

# Run
yarn dev
```

API available at `http://localhost:3000`. Documentation at `http://localhost:3000/docs`.

### Configuration

Set the following in `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://..."
JWT_SECRET="secret"
INFURA_NODE_URL="https://..."
CONTRACT_ADDRESS="0x..."
```

## Testing

```bash
yarn test
```

## Project Structure

- `src/auth`: Authentication
- `src/raffles`: Campaign management
- `src/wallets`: User management
- `src/contract`: Web3 integration
