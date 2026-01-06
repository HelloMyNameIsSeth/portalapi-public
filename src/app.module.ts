import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TokenTypesModule } from './token-types/token-types.module';
import { RafflesModule } from './raffles/raffles.module';
import { RaffleEntriesModule } from './raffle-entries/raffle-entries.module';
import { TokensModule } from './tokens/tokens.module';
import { WalletsModule } from './wallets/wallets.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ContractModule } from './contract/contract.module';
import { AdminModule } from './admin/admin.module';
import { WinnersModule } from './winners/winners.module';
import { StoreModule } from 'store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    TokenTypesModule,
    RafflesModule,
    RaffleEntriesModule,
    TokensModule,
    WalletsModule,
    AuthModule,
    ContractModule,
    AdminModule,
    WinnersModule,
    StoreModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
