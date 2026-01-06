import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
