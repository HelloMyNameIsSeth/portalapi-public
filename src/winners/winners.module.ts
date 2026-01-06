import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma.module';
import { WinnersService } from './winners.service';

@Module({
  imports: [PrismaModule],
  providers: [WinnersService],
  exports: [WinnersService],
})
export class WinnersModule {}
