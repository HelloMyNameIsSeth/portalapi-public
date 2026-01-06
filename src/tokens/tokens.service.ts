import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { computeImageUrl } from 'utils/computeImageUrl';

@Injectable()
export class TokensService {
  constructor(private prisma: PrismaService) {}

  async getTokensByIds(ids: number[]) {
    const tokens = await this.prisma.token.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        tokenType: true,
      },
    });

    return tokens.map((token) => computeImageUrl(token));
  }
}
