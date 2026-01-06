import { Token } from '@prisma/client';
import { WithImageUrl } from 'types';
import * as projectConfig from '../../config.json';

export function computeImageUrl<T extends Token>(token: T): WithImageUrl<T> {
  return {
    ...token,
    imageUrl: `${projectConfig.base_img_url}/${token.id}.png`,
  };
}
