import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';

@Injectable()
export class ShopifyService {
  constructor(private prisma: PrismaService) {}
}
