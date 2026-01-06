import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';

@Injectable()
export class WinnersService {
  constructor(private prisma: PrismaService) {}

  getWinnersByRaffleIdTokenTypeId(raffleId: number, tokenTypeId: number) {
    return this.prisma.winner.findMany({
      where: {
        raffle: { id: raffleId },
        tokenType: { id: tokenTypeId },
      },
      include: {
        entry: {
          include: {
            token: true,
            wallet: true,
          },
        },
      },
    });
  }

  getWinnersByRaffleId(raffleId: number) {
    return this.prisma.winner.findMany({
      where: { raffleId },
      include: {
        entry: {
          include: {
            wallet: true,
          },
        },
      },
    });
  }

  insertWinner(raffleEntryId: number, tokenTypeId: number, raffleId: number) {
    return this.prisma.winner.create({
      data: {
        raffle: {
          connect: {
            id: Number(raffleId),
          },
        },
        entry: {
          connect: {
            id: Number(raffleEntryId),
          },
        },
        tokenType: {
          connect: {
            id: Number(tokenTypeId),
          },
        },
      },
      include: {
        entry: {
          include: {
            token: true,
            wallet: true,
          },
        },
      },
    });
  }
}
