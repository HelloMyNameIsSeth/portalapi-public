import { PrismaClient } from '@prisma/client';
import { generateRandomNonce } from '../../src/wallets/wallets.helper';

export default async function seedWallets(prisma: PrismaClient) {
  const devAddresses = ['0xdfc6b87d09151c659b0e4afe064cbaac8d464ed7'];

  for (const [index, publicAddress] of devAddresses.entries()) {
    const nonce = generateRandomNonce(publicAddress);

    await prisma.wallet.create({
      data: {
        id: index + 1,
        publicAddress,
        nonce,
        isAdmin: true,
      },
    });
  }
}
