export class RaffleAdmin {
  id: number;
  name: string;
  endDate: Date;
  canWinInMultipleTokenTypes: boolean;
  active: boolean;
  tokenTypes: RaffleTokenType[];
}

export class AdminEditRaffle {
  name: string;
  endDate: Date;
  active: boolean;
  canWinInMultipleTokenTypes: boolean;
  tokenTypeIds: number[];
}

export class RaffleTokenType {
  raffleId: number;
  tokenTypeId: number;
}
