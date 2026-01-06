# Portal API - NFT Raffle Management System

A robust REST API for managing NFT-based raffle campaigns, wallet authentication, and token management. Built with **NestJS**, **Prisma ORM**, and **Ethereum** smart contract integration.

## Project Overview

Portal API is a comprehensive backend system designed for hosting raffle events where NFT token holders can participate. The system handles:

- **Wallet Authentication**: Secure Web3 wallet authentication using signed messages
- **Raffle Management**: Create, manage, and track multiple raffle campaigns
- **NFT Integration**: Real-time token data from Ethereum smart contracts
- **Winner Selection**: Automated winner selection and tracking
- **User Management**: Admin controls and wallet-based user profiles

Perfect for NFT communities, gaming projects, and blockchain-based incentive programs.

## Key Features

### Authentication & Security
- **Web3 Wallet Authentication**: Sign messages with MetaMask or compatible wallets
- **JWT Tokens**: Secure token-based authentication
- **Admin Controls**: Role-based access control for administrative functions
- **Environment Variable Management**: All secrets stored securely in environment variables

### Raffle System
- Create and manage multiple raffle campaigns
- Token-type specific raffles 
- Real-time raffle status tracking
- Multi-token type raffle support
- Configurable end dates and raffle rules

### Token Management
- Fetch wallet token holdings from smart contracts
- Token metadata integration
- Token type categorization
- Raffle-specific token requirements

### Wallet Integration
- Wallet discovery and creation
- Nonce-based security challenges
- Admin flag management
- Token ownership verification

### Winner Management
- Automated winner selection
- Multiple winner type support
- Winner tracking and history
- Token-type specific winner lists

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **NestJS** | Progressive Node.js framework for building scalable APIs |
| **Prisma** | Modern ORM for database operations |
| **PostgreSQL** | Reliable relational database |
| **Ethereum / Web3** | Smart contract integration and wallet verification |
| **JWT** | Secure API authentication |
| **Fastify** | High-performance HTTP server |
| **Docker** | Containerization and development environment |

## Architecture

### Database Schema
```
Wallets
├── Raffle Entries
│   ├── Tokens
│   ├── Token Types
│   ├── Raffles
│   └── Winners
```

### Core Entities
- **Wallet**: User's Ethereum address and authentication state
- **Raffle**: Campaign details, status, and configuration
- **Token**: NFT token with metadata and type
- **RaffleEntry**: User participation in specific raffles
- **Winner**: Selected winners from raffle entries
- **TokenType**: Categories of tokens 

## Getting Started

### Prerequisites
- Node.js 14+ and Yarn/npm
- Docker & Docker Compose (for database)
- PostgreSQL 13+ (or use Docker)
- Ethereum wallet with testnet funds (for development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/portalapi-public.git
cd portalapi-public
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the database (Docker)**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
yarn prisma migrate dev
```

6. **Seed the database (optional)**
```bash
yarn db:seed
```

7. **Start the development server**
```bash
yarn dev
```

The API will be available at `http://localhost:3000`
API documentation will be available at `http://localhost:3000/docs`

## API Endpoints

### Authentication
- `POST /auth/nonce` - Get authentication nonce for wallet
- `POST /auth/verify` - Verify signed message and receive JWT

### Raffles
- `GET /raffles/active` - List all active raffles
- `GET /raffles/:id` - Get specific raffle details
- `POST /raffles/:id/entries` - Enter a raffle (requires JWT)
- `GET /raffles/:id/winners` - Get raffle winners

### Wallets
- `GET /wallets/tokens` - Get tokens owned by authenticated wallet
- `GET /wallets/tokens/v2` - Get tokens with extended metadata

### Tokens
- `GET /tokens/:id` - Get token details
- `GET /tokens` - List all tokens

### Admin
- `POST /admin/raffles` - Create raffle (admin only)
- `PATCH /admin/raffles/:id` - Update raffle (admin only)
- `POST /admin/winners` - Select and record winners (admin only)

## Configuration

### Environment Variables
```env
# Server
ENV=development
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DATABASE=portal_dev

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Blockchain
INFURA_NODE_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Smart Contract
CONTRACT_ADDRESS=0x1347A97789cd3Aa0b11433E8117F55Ab640A0451
```

## Project Structure

```
src/
├── admin/           # Admin-only operations
├── auth/            # Authentication & JWT
├── contract/        # Smart contract integration
├── raffles/         # Raffle management
├── raffle-entries/  # Raffle entry handling
├── tokens/          # Token management
├── token-types/     # Token type management
├── wallets/         # Wallet operations
├── winners/         # Winner management
├── store/           # External service integrations
├── entities/        # Custom entity definitions
└── utils/           # Utility functions
```

## Testing

Run the test suite:
```bash
yarn test
```

Run tests in watch mode:
```bash
yarn test:watch
```

## Available Scripts

| Command | Purpose |
|---------|---------|
| `yarn dev` | Start dev server with watch mode |
| `yarn build` | Build the project for production |
| `yarn start` | Run production build |
| `yarn start:dev` | Start with watch mode |
| `yarn start:prod` | Run compiled production code |
| `yarn db:studio` | Open Prisma Studio for database visualization |
| `yarn db:seed` | Seed database with initial data |
| `yarn lint` | Run ESLint with auto-fix |

## Security Features

- **Web3 Wallet Authentication** - Cryptographic verification of wallet ownership
- **JWT-Based Sessions** - Stateless, secure API authentication
- **Environment Variable Secrets** - No credentials in source code
- **Admin Role Protection** - Role-based access control
- **Nonce Validation** - Prevents replay attacks
- **CORS Configuration** - Secure cross-origin requests

## Deployment

### Docker Deployment

```bash
docker build -t portalapi .
docker run -p 3000:3000 --env-file .env portalapi
```

### Heroku Deployment

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:standard-0
git push heroku main
```

## License

This project is licensed under the UNLICENSED license - see the LICENSE file for details.

## Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Ethereum.js](https://www.ethereum.org/) - Ethereum integration
- [Fastify](https://www.fastify.io/) - Web framework

