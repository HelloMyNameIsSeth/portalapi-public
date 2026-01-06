import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma.module';
import { StoreController } from './store.controller';

@Module({
  imports: [PrismaModule],
  controllers: [StoreController],
  providers: [],
  exports: [],
})
export class StoreModule {}
