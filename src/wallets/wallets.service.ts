import { Injectable } from '@nestjs/common';
import { Wallet } from '@prisma/client';
import { PrismaService } from 'prisma.service';
import { generateRandomNonce } from './wallets.helper';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async upsertByPublicAddress({
    nonce,
    address,
  }: {
    nonce: string;
    address: string;
  }) {
    return this.prisma.wallet.upsert({
      where: { publicAddress: address.toLowerCase() },
      update: { nonce },
      create: { nonce, publicAddress: address.toLowerCase() },
    });
  }

  async findByPublicAddress(publicAddress: string) {
    return this.prisma.wallet.findUnique({ where: { publicAddress } });
  }

  async refreshNonce(wallet: Wallet): Promise<void> {
    const newNonce = generateRandomNonce(wallet.publicAddress);

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { nonce: newNonce },
    });
  }
}
