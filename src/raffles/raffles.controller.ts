import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { isBefore } from 'date-fns';
import { ContractService } from '../contract/contract.service';
import { RaffleEntriesService } from '../raffle-entries/raffle-entries.service';
import { WalletsService } from '../wallets/wallets.service';
import { TokensService } from '../tokens/tokens.service';
import { computeImageUrl } from 'utils/computeImageUrl';
import { Raffle } from 'generated/nestjs-dto/raffle.entity';
import { Winner } from 'generated/nestjs-dto/winner.entity';
import { RaffleEntry } from 'generated/nestjs-dto/raffleEntry.entity';
import { ActiveRaffle } from 'entities/activeRaffle.entity';
import { RaffleEntryV2 } from 'entities/raffleEntry.entity';
import { RaffleWinner } from 'entities/raffleWinner.entity';

@Controller('raffles')
export class RafflesController {
  constructor(
    private readonly rafflesService: RafflesService,
    private readonly contractService: ContractService,
    private readonly raffleEntriesService: RaffleEntriesService,
    private readonly walletsService: WalletsService,
    private readonly tokensService: TokensService,
  ) {}

  @Get('/active')
  getActiveRaffles(): Promise<Raffle[]> {
    return this.rafflesService.getActiveRaffles();
  }

  @Get('/active')
  @Version('2')
  async getActiveRafflesV2(): Promise<ActiveRaffle[]> {
    const raffles = await this.rafflesService.getActiveRaffles();
    const data = await Promise.all(
      raffles.map(async (raffle) => {
        return {
          id: raffle.id,
          name: raffle.name,
          endDate: raffle.endDate,
          tokenTypes: raffle.tokenTypes.map(
            (tokenType) => tokenType.tokenTypeId,
          ),
          addresses: Array.from(
            new Set(raffle.entries.map((entry) => entry.wallet.publicAddress)),
          ),
          entryCountByType: await this.raffleEntriesService.getEntryCountByType(
            raffle.id,
          ),
        };
      }),
    );

    return data;
  }

  @Get('/recent')
  @Version('2')
  async getRecentRaffles() {
    const raffles = await this.rafflesService.getRecentRaffles(3);
    const data = await Promise.all(
      raffles.map(async (raffle) => {
        return {
          id: raffle.id,
          type: raffle.type || 'Whitelist Spots',
          name: raffle.name,
          image: raffle.image,
          value: raffle.value,
          endDate: raffle.endDate,
        };
      }),
    );

    return data;
  }

  @Get('/:id/entries/:tokenTypeId?')
  async getEntries(
    @Param('id', ParseIntPipe) id: number,
    @Param('tokenTypeId', ParseIntPipe) tokenTypeId?: number,
  ): Promise<RaffleEntry[]> {
    const raffle = await this.rafflesService.getById(id);

    if (!raffle) {
      throw new NotFoundException();
    }

    raffle.entries = raffle.entries.map((entry) => {
      entry.token = computeImageUrl(entry.token);
      return entry;
    });

    return tokenTypeId
      ? raffle.entries.filter((entry) => entry.tokenTypeId === tokenTypeId)
      : raffle.entries;
  }

  @Get('/:id/entries/:tokenTypeId?')
  @Version('2')
  async getEntriesV2(
    @Param('id', ParseIntPipe) id: number,
    @Param('tokenTypeId', ParseIntPipe) tokenTypeId?: number,
  ): Promise<RaffleEntryV2[]> {
    const raffle = await this.rafflesService.getById(id);

    if (!raffle) {
      throw new NotFoundException();
    }

    const entries = await this.rafflesService.getRaffleEntries(id, tokenTypeId);
    const data: RaffleEntryV2[] = entries.map((entry) => ({
      id: entry.id,
      tokenId: entry.tokenId,
      imageUrl: computeImageUrl(entry.token).imageUrl,
      publicAddress: entry.wallet.publicAddress,
    }));

    return data;
  }

  @Get('/:id/winners')
  async getWinners(
    @Req() request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Winner[]> {
    const raffle = await this.rafflesService.getById(id);

    if (!raffle) {
      throw new NotFoundException();
    }

    return raffle.winners;
  }

  @Get('/:id/winners')
  @Version('2')
  async getWinnersV2(
    @Req() request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RaffleWinner[]> {
    const raffle = await this.rafflesService.getById(id);

    if (!raffle) {
      throw new NotFoundException();
    }

    const winners = await this.rafflesService.getRaffleWinners(id);
    const data: RaffleWinner[] = winners.map((winner) => ({
      id: winner.id,
      tokenId: winner.entry.tokenId,
      tokenTypeId: winner.tokenTypeId,
      imageUrl: computeImageUrl(winner.entry.token).imageUrl,
      publicAddress: winner.entry.wallet.publicAddress,
    }));

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/enter/')
  async enterRaffle(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Raffle> {
    console.log("address", req?.user?.publicAddress);
    if (!req.user.publicAddress) {
      throw new BadRequestException();
    }
    
    const [wallet, raffle] = await Promise.all([
      this.walletsService.findByPublicAddress(req.user.publicAddress),
      this.rafflesService.getById(id),
    ]);
      
    console.log("wallet", wallet);
    console.log("raffle", raffle);
      
    if (!raffle) {
      throw new NotFoundException();
    }
      
    console.log("IsBefore Function", isBefore(Date.now(), raffle.endDate));
   
    if (!isBefore(Date.now(), raffle.endDate)) {
      throw new BadRequestException();
    }

    const walletTokens = await this.contractService.getWalletOfOwner(
      req.user.publicAddress,
    );
    console.log("WalletToken Length",walletTokens.length);
    if (walletTokens.length === 0) {
      throw new ForbiddenException();
    }
  
    const tokens = await this.tokensService.getTokensByIds(walletTokens);

    await this.raffleEntriesService.deleteEntriesByTokens(tokens, raffle);
    await this.raffleEntriesService.deleteEntriesByWallet(wallet, raffle);
    console.log("Delete Entries Function", tokens)
    const allowedTokenTypeIds = raffle.tokenTypes.map((tt) => tt.tokenTypeId);
    const filteredTokens = tokens.filter((token) =>
      allowedTokenTypeIds.includes(token.tokenType.id),
    );
    
    if (filteredTokens.length === 0) {
      throw new BadRequestException();
    }
    console.log("filtered tokens", filteredTokens)
    await this.raffleEntriesService.enter(filteredTokens, wallet, raffle);
    console.log("successfully invoked")
    return this.rafflesService.getById(raffle.id);
  }

  @Get('/history')
  history(): Promise<Raffle[]> {
    return this.rafflesService.getEndedRaffles();
  }
}
