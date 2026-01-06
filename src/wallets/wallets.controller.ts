import {
  BadRequestException,
  Controller,
  Get,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { WalletToken } from 'entities/walletToken.entity';
import { Token } from 'generated/nestjs-dto/token.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ContractService } from '../contract/contract.service';
import { TokensService } from '../tokens/tokens.service';
import { WalletsService } from './wallets.service';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(
    private readonly contractService: ContractService,
    private readonly tokenService: TokensService,
    private readonly walletsService: WalletsService,
  ) {}

  @Get('/tokens')
  async walletTokens(@Req() req): Promise<Token[]> {
    if (!req.user.publicAddress) {
      throw new BadRequestException();
    }

    const tokenIds = await this.contractService.getWalletOfOwner(
      req.user.publicAddress,
    );

    
    return this.tokenService.getTokensByIds(tokenIds);
  }

  @Get('/tokens')
  @Version('2')
  async walletTokensV2(@Req() req): Promise<WalletToken[]> {
    if (!req.user.publicAddress) {
      throw new BadRequestException();
    }

    const tokenIds = await this.contractService.getWalletOfOwner(
      req.user.publicAddress,
    );

    const tokens = await this.tokenService.getTokensByIds(tokenIds);
    return tokens.map((token) => ({
      id: token.id,
      imageUrl: token.imageUrl,
      tokenTypeId: token.tokenTypeId,
    }));
  }

  @Get('/me')
  async me(@Req() req): Promise<{ publicAddress: string; isAdmin: boolean }> {
    if (!req.user.publicAddress) throw new BadRequestException();

    const wallet = await this.walletsService.findByPublicAddress(
      req.user.publicAddress,
    );

    return {
      publicAddress: wallet.publicAddress,
      isAdmin: wallet.isAdmin,
    };
  }
}
