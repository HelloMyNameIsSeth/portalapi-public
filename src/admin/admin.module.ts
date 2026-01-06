import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { RaffleEntriesModule } from '../raffle-entries/raffle-entries.module';
import { WinnersModule } from '../winners/winners.module';
import { RafflesModule } from '../raffles/raffles.module';
import { TokenTypesModule } from '../token-types/token-types.module';
import { PrismaModule } from 'prisma.module';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({}),
    RaffleEntriesModule,
    WinnersModule,
    RafflesModule,
    TokenTypesModule,
    PrismaModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
