import { Injectable } from '@nestjs/common';
import { Raffle, Token, Wallet } from '@prisma/client';
import { PrismaService } from 'prisma.service';
import * as ProjectConfig from '../../config.json';
import { WinnersService } from '../winners/winners.service';

@Injectable()
export class RaffleEntriesService {
  private entriesStacked: boolean;

  constructor(
    private prisma: PrismaService,
    private winnersService: WinnersService,
  ) {
    const { entries_stacked } = ProjectConfig;

    if (![true, false].includes(entries_stacked)) {
      throw new Error('bad config.json, no enties_stacked');
    }

    this.entriesStacked = entries_stacked;
  }

  async getEntryCountByType(raffleId: number) {
    const tokenTypes = await this.prisma.raffleTokenType.findMany({
      where: {
        raffleId: raffleId,
      },
    });

    const defaultEntryCount = Object.fromEntries(
      tokenTypes.map((tokenType) => [tokenType.tokenTypeId, 0]),
    );

    const entryCountByType = await this.prisma.raffleEntry.groupBy({
      by: ['tokenTypeId'],
      where: {
        raffleId,
      },
      _count: true,
    });

    return Object.assign(
      defaultEntryCount,
      Object.fromEntries(
        entryCountByType.map((count) => [count.tokenTypeId, count._count]),
      ),
    );
  }

  findByRaffleIdAndWalletId({
    raffle,
    wallet,
  }: {
    raffle: Raffle;
    wallet: Wallet;
  }) {
    return this.prisma.raffleEntry.findMany({
      where: {
        raffleId: raffle.id,
        walletId: wallet.id,
      },
    });
  }

  deleteEntriesByWallet(wallet: Wallet, raffle: Raffle) {
    return this.prisma.raffleEntry.deleteMany({
      where: {
        walletId: wallet.id,
        raffleId: raffle.id,
      },
    });
  }

  deleteEntriesByTokens(tokens: Token[], raffle: Raffle) {
    return this.prisma.raffleEntry.deleteMany({
      where: {
        tokenId: {
          in: tokens.map((token) => token.id),
        },
        raffleId: raffle.id,
      },
    });
  }

  enter(tokens: Token[], wallet: Wallet, raffle: Raffle) {
    console.log("Entries Stacked", this.entriesStacked);
    console.log("Prisma Data", tokens.map((token) => ({
          tokenId: token.id,
          tokenTypeId: token.tokenTypeId,
          walletId: wallet.id,
          raffleId: raffle.id,
    })));
    if (this.entriesStacked) {
      return this.prisma.raffleEntry.createMany({
        data: tokens.map((token) => ({
          tokenId: token.id,
          tokenTypeId: token.tokenTypeId,
          walletId: wallet.id,
          raffleId: raffle.id,
        })),
      });
    } else {
      const maxEntryByTokenType = {
        1: 100,
        2: 100,
        3: 100,
        4: 100,
        5: 100,
      };

      const usedTokens: Record<number, Token[]> = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
      };

      tokens.forEach((token) => {
        const tokenTypeId = [5, 6].includes(token.tokenTypeId)
          ? 5
          : token.tokenTypeId;

        const maxAllowed: number = maxEntryByTokenType[tokenTypeId];
        const alreadyUsed = usedTokens[tokenTypeId];

        if (alreadyUsed.length >= maxAllowed) {
          return;
        }

        usedTokens[tokenTypeId].push(token);
      });

      const allUsed = [
        ...usedTokens[1],
        ...usedTokens[2],
        ...usedTokens[3],
        ...usedTokens[4],
        ...usedTokens[5],
      ];

      return this.prisma.raffleEntry.createMany({
        data: allUsed.map((token) => ({
          tokenId: token.id,
          tokenTypeId: token.tokenTypeId,
          walletId: wallet.id,
          raffleId: raffle.id,
        })),
      });
    }
  }

  async findEligibleEntries(raffle: Raffle, tokenTypeId: number) {
    if (raffle.canWinInMultipleTokenTypes) {
      const alreadyWonEntries =
        await this.winnersService.getWinnersByRaffleIdTokenTypeId(
          raffle.id,
          tokenTypeId,
        );

      const alreadyWonEntryIds = alreadyWonEntries.map(
        (entry) => entry.raffleEntryId,
      );

      return this.prisma.raffleEntry.findMany({
        where: {
          id: { notIn: alreadyWonEntryIds },
          tokenTypeId: { in: [tokenTypeId, 5, 6] },
          raffleId: raffle.id,
        },
        include: { token: true, wallet: true },
      });
    }

    const alreadyWonEntries = await this.winnersService.getWinnersByRaffleId(
      raffle.id,
    );

    const alreadyWonWalletIds = alreadyWonEntries.map(
      (winner) => winner.entry.wallet.id,
    );

    const eligibleEntries = await this.prisma.raffleEntry.findMany({
      where: {
        tokenTypeId: { in: [tokenTypeId, 5, 6] },
        raffleId: raffle.id,
        walletId: { notIn: alreadyWonWalletIds },
      },
      include: {
        token: true,
        wallet: true,
      },
    });

    return eligibleEntries;
  }
}
