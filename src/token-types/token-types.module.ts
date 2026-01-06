import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma.module';
import { TokenTypesService } from './token-types.service';

@Module({
  imports: [PrismaModule],
  providers: [TokenTypesService],
  exports: [TokenTypesService],
})
export class TokenTypesModule {}
