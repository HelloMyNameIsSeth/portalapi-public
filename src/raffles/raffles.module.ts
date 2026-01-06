import { Module } from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { RafflesController } from './raffles.controller';
import { ContractModule } from '../contract/contract.module';
import { PassportModule } from '@nestjs/passport';
import { RaffleEntriesModule } from '../raffle-entries/raffle-entries.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TokensModule } from '../tokens/tokens.module';
import { PrismaModule } from 'prisma.module';

@Module({
  imports: [
    ContractModule,
    PassportModule.register({}),
    RaffleEntriesModule,
    WalletsModule,
    PrismaModule,
    TokensModule,
  ],
  controllers: [RafflesController],
  providers: [RafflesService],
  exports: [RafflesService],
})
export class RafflesModule {}
