import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { RaffleEntry, Prisma } from '@prisma/client';
import { isBefore } from 'date-fns';
import { AdminEditRaffle, RaffleAdmin } from 'entities/admin.entity';
import { Winner } from 'generated/nestjs-dto/winner.entity';
import { PrismaService } from 'prisma.service';
import { computeImageUrl } from 'utils/computeImageUrl';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RaffleEntriesService } from '../raffle-entries/raffle-entries.service';
import { RafflesService } from '../raffles/raffles.service';
import { TokenTypesService } from '../token-types/token-types.service';
import { WinnersService } from '../winners/winners.service';
import { AdminGuard } from './admin.guard';

type DrawWinnerBody = {
  raffleId: number;
  tokenTypeId: number;
  count: number;
};

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly raffleEntriesService: RaffleEntriesService,
    private readonly winnersService: WinnersService,
    private readonly rafflesService: RafflesService,
    private readonly tokenTypesService: TokenTypesService,
    private prisma: PrismaService,
  ) {}

  @Get('/drawWinner')
  async drawWinner(@Query() query): Promise<{ winners: RaffleEntry[] }> {
    const { raffleId, tokenTypeId, count = 1 } = query;
    if (!raffleId || !tokenTypeId || !count) {
      throw new BadRequestException();
    }

    const raffle = await this.rafflesService.getById(parseInt(raffleId));

    if (
      process.env.NODE_ENV !== 'development' &&
      isBefore(Date.now(), raffle.endDate)
    ) {
      throw new BadRequestException();
    }

    const winners: RaffleEntry[] = [];

    for (let i = 0; i < count; i++) {
      const eligibleEntries =
        await this.raffleEntriesService.findEligibleEntries(
          raffle,
          parseInt(tokenTypeId),
        );

      const randomIdx = Math.floor(Math.random() * eligibleEntries.length);
      const winner = eligibleEntries[randomIdx];

      if (!winner) {
        break;
      }

      winners.push(winner);

      await this.winnersService.insertWinner(winner.id, tokenTypeId, raffleId);
    }

    return { winners };
  }

  @Post('/drawWinner')
  @Version('2')
  async drawWinnerV2(
    @Body() body: DrawWinnerBody,
  ): Promise<{ winners: Winner[] }> {
    const { raffleId, tokenTypeId, count = 1 } = body;

    if (!raffleId || !tokenTypeId || !count) {
      throw new BadRequestException();
    }

    const raffle = await this.rafflesService.getById(raffleId);

    if (!raffle) {
      throw new BadRequestException();
    }

    if (
      process.env.NODE_ENV !== 'development' &&
      isBefore(Date.now(), raffle.endDate)
    ) {
      throw new BadRequestException();
    }

    for (let i = 0; i < count; i++) {
      const eligibleEntries =
        await this.raffleEntriesService.findEligibleEntries(
          raffle,
          tokenTypeId,
        );

      const randomIdx = Math.floor(Math.random() * eligibleEntries.length);
      const eligibleEntry = eligibleEntries[randomIdx];

      if (!eligibleEntry) {
        break;
      }

      await this.winnersService.insertWinner(
        eligibleEntry.id,
        tokenTypeId,
        raffleId,
      );
    }

    let winners = await this.winnersService.getWinnersByRaffleIdTokenTypeId(
      raffleId,
      tokenTypeId,
    );

    winners = winners.map((winner) => {
      winner.entry.token = computeImageUrl(winner.entry.token);
      return winner;
    });

    return { winners };
  }

  @Post('/raffle')
  async createRaffle(@Body() raffle: Prisma.RaffleCreateInput) {
    // const newRaffle = { ...new Raffle(), ...raffle, tokenTypes };
    // return this.rafflesService.save(newRaffle);
    return this.rafflesService.save(raffle);
  }

  @Patch('/raffle/:id')
  async editRaffle(@Body() raffle: AdminEditRaffle, @Param('id') id: string) {
    const existingRaffle = await this.rafflesService.getById(parseInt(id));

    if (!existingRaffle) {
      throw new BadRequestException();
    }

    await this.prisma.raffleTokenType.deleteMany({
      where: {
        raffleId: parseInt(id),
      },
    });

    return this.rafflesService.update(parseInt(id), {
      name: raffle.name,
      active: raffle.active,
      canWinInMultipleTokenTypes: raffle.canWinInMultipleTokenTypes,
      endDate: raffle.endDate,
      tokenTypes: {
        createMany: {
          data: raffle.tokenTypeIds.map((tokenType) => ({
            tokenTypeId: tokenType,
          })),
        },
      },
    });
  }

  @Get('/raffle')
  getAllRaffles(): Promise<RaffleAdmin[]> {
    return this.rafflesService.all();
  }
}
