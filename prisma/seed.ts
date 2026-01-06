import { PrismaClient } from '@prisma/client';
import seedRaffles from './seeders/raffles';
import seedTokenTypes from './seeders/tokenTypes';
import seedWallets from './seeders/wallets';
import seedTokens from './seeders/tokens';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TokenTypes');
  await seedTokenTypes(prisma);

  console.log('Seeding Raffles');
  await seedRaffles(prisma);

  console.log('Seeding Wallets');
  await seedWallets(prisma);

  console.log('Seeding Tokens');
  await seedTokens(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
