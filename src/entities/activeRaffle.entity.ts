export class ActiveRaffle {
  id: number;
  name: string;
  endDate: Date;
  tokenTypes: number[];
  addresses: string[];
  entryCountByType: Record<string, number>;
}
