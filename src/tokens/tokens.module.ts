import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma.module';
import { TokensService } from './tokens.service';

@Module({
  controllers: [],
  imports: [PrismaModule],
  exports: [TokensService],
  providers: [TokensService],
})
export class TokensModule {}
