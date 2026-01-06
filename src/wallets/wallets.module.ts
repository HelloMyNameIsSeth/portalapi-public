import { Module, forwardRef } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { PassportModule } from '@nestjs/passport';
import { WalletsController } from './wallets.controller';
import { AuthModule } from '../auth/auth.module';
import { ContractModule } from '../contract/contract.module';
import { TokensModule } from '../tokens/tokens.module';
import { PrismaModule } from 'prisma.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PassportModule.register({}),
    PrismaModule,
    ContractModule,
    TokensModule,
  ],
  providers: [WalletsService],
  exports: [WalletsService],
  controllers: [WalletsController],
})
export class WalletsModule {}
