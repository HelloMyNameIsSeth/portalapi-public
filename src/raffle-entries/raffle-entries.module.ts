import { Module } from '@nestjs/common';
import { RaffleEntriesService } from './raffle-entries.service';
import { WinnersModule } from '../winners/winners.module';
import { PrismaModule } from 'prisma.module';

@Module({
  imports: [WinnersModule, PrismaModule],
  providers: [RaffleEntriesService],
  exports: [RaffleEntriesService],
})
export class RaffleEntriesModule {}
