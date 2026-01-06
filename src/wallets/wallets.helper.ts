import * as crypto from 'crypto';

export const generateRandomNonce = (address: string): string => {
  return crypto
    .createHash('md5')
    .update(`${address}${Math.floor(Math.random() * 1000000000)}`)
    .digest('hex');
};
