import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IValidateSignedNonceBody } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':wallet')
  async getNonce(@Param('wallet') wallet: string) {
    return this.authService.findOrInsertByPublicAddress(wallet);
  }

  @Post('/validate')
  validateSignedNonce(@Body() body: IValidateSignedNonceBody) {
    return this.authService.validateSignedNonce(body);
  }
}
