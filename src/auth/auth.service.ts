import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  bufferToHex,
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  publicToAddress,
} from 'ethereumjs-util';
import * as projectConfig from '../../config.json';
import { generateRandomNonce } from '../wallets/wallets.helper';
import { WalletsService } from '../wallets/wallets.service';
import { IFindOrInsertByPublicAddressResult } from './auth.dto';

@Injectable()
export class AuthService {
  private signedMessagePrefix: string;

  constructor(
    private readonly walletService: WalletsService,
    private readonly jwtService: JwtService,
  ) {
    const { signed_message_prefix } = projectConfig;

    if (!signed_message_prefix)
      throw new Error('Bad config.json, missing signedMessagePrefix');

    this.signedMessagePrefix = signed_message_prefix;
  }

  async findOrInsertByPublicAddress(
    address: string,
  ): Promise<IFindOrInsertByPublicAddressResult> {
    const nonce = generateRandomNonce(address);

    await this.walletService.upsertByPublicAddress({ nonce, address });

    return { nonce, publicAddress: address };
  }

  async validateSignedNonce({
    publicAddress,
    signedMessage,
  }: {
    publicAddress: string;
    signedMessage: string;
  }) {
    try {
      const wallet = await this.walletService.findByPublicAddress(
        publicAddress,
      );

      if (!wallet) throw new NotFoundException();

      const msg = `${this.signedMessagePrefix}${wallet.nonce}`;

      const msgBuffer = Buffer.from(msg, 'utf8');
      const msgHash = hashPersonalMessage(msgBuffer);

      const signedMessageParams = fromRpcSig(signedMessage);

      const publicKey = ecrecover(
        msgHash,
        signedMessageParams.v,
        signedMessageParams.r,
        signedMessageParams.s,
      );

      const addressBuffer = publicToAddress(publicKey);
      const address = bufferToHex(addressBuffer);

      if (address.toLowerCase() === wallet.publicAddress.toLowerCase()) {
        await this.walletService.refreshNonce(wallet);

        return {
          accessToken: this.jwtService.sign({
            publicAddress: address,
            isAdmin: wallet.isAdmin,
          }),
        };
      }
    } catch (e) {
      console.log(e);
      throw new UnprocessableEntityException();
    }
  }
}
