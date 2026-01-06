import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma.service';

@Injectable()
export class RafflesService {
  constructor(private prisma: PrismaService) {}

  async getActiveRaffles() {
    return this.prisma.raffle.findMany({
      where: {
        active: true,
      },
      orderBy: { endDate: 'asc' },
      include: {
        winners: true,
        tokenTypes: true,
        entries: {
          include: {
            wallet: true,
            tokenType: true,
          },
        },
      },
    });
  }

  async getRecentRaffles(take: number) {
    return this.prisma.raffle.findMany({
      where: {
        active: false,
        endDate: {
          lte: new Date(),
        },
      },
      take,
      orderBy: {
        endDate: 'desc',
      },
    });
  }

  async getRaffleEntries(raffleId: number, tokenTypeId?: number) {
    return this.prisma.raffleEntry.findMany({
      where: {
        raffleId,
        tokenTypeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        token: true,
        wallet: true,
      },
    });
  }

  async getRaffleWinners(raffleId: number) {
    return this.prisma.winner.findMany({
      where: {
        raffleId,
      },
      include: {
        entry: {
          include: {
            wallet: true,
            token: true,
          },
        },
      },
    });
  }

  getById(id: number) {
    return this.prisma.raffle.findUnique({
      where: { id },
      include: {
        winners: true,
        entries: {
          include: {
            wallet: true,
            tokenType: true,
            token: true,
          },
        },
        tokenTypes: true,
      },
    });
  }

  getEndedRaffles() {
    const now = new Date();
    return this.prisma.raffle.findMany({
      where: {
        endDate: {
          lt: now,
        },
      },
      orderBy: {
        endDate: 'desc',
      },
      include: {
        entries: true,
        winners: {
          include: {
            entry: {
              include: {
                token: true,
                wallet: true,
              },
            },
          },
        },
        tokenTypes: true,
      },
    });
  }

  save(data: Prisma.RaffleCreateInput) {
    return this.prisma.raffle.create({ data });
  }

  update(id: number, data: Prisma.RaffleUpdateInput) {
    return this.prisma.raffle.update({
      where: {
        id,
      },
      data,
    });
  }

  all() {
    return this.prisma.raffle.findMany({
      orderBy: { createdAt: 'desc' },
      include: { tokenTypes: true, entries: true, winners: true },
    });
  }
}
