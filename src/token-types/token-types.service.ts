import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';

@Injectable()
export class TokenTypesService {
  constructor(private prisma: PrismaService) {}

  getByIds(ids: number[]) {
    return this.prisma.tokenType.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
