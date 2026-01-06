import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import NodeCache from 'node-cache';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import * as projectConfig from '../../config.json';

@Injectable()
export class ContractService {
  private web3: Web3;
  private contract: Contract;
  private cache: NodeCache;

  constructor(private readonly configService: ConfigService) {
    const infuraNodeUrl = configService.get('INFURA_NODE_URL');

    if (!infuraNodeUrl) {
      throw new Error('no INFURA_NODE_URL');
    }

    const { contract_abi, contract_address } = projectConfig;

    if (!contract_abi || !contract_address) {
      throw new Error(
        'Missing contract_abi or contract_address in config.json',
      );
    }

    this.web3 = new Web3(infuraNodeUrl);
    this.contract = new this.web3.eth.Contract(
      contract_abi as AbiItem[],
      contract_address,
    );
    this.cache = new NodeCache({ stdTTL: 60, checkperiod: 30 });
  }

  async getWalletOfOwner(walletAddress: string): Promise<number[]> {
    const cachedTokens: string[] | undefined = this.cache.get(walletAddress);

    if (cachedTokens) {
      return cachedTokens.map((t) => parseInt(t));
    }

    const tokens: string[] = await this.contract.methods
      .walletOfOwner(walletAddress)
      .call();

    this.cache.set(walletAddress, tokens);

    return tokens.map((t) => parseInt(t));
  }
}
