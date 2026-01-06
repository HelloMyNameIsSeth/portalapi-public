export class IValidateSignedNonceBody {
  signedMessage: string;
  publicAddress: string;
}

export class IFindOrInsertByPublicAddressResult {
  nonce: string;
  publicAddress: string;
}
