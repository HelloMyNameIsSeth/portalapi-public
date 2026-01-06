import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

export default async function seedTokens(prisma: PrismaClient) {
  const tokensSql = await fs.readFile(path.join(__dirname, '../tokens.sql'), {
    encoding: 'utf-8',
  });

  const sqlReducedToStatements = tokensSql
    .split('\n')
    .filter((line) => !line.startsWith('--')) // remove comments-only lines
    .join('\n')
    .replace(/\r\n|\n|\r/g, ' ') // remove newlines
    .replace(/\s+/g, ' '); // excess white space
  const sqlStatements = splitStringByNotQuotedSemicolon(sqlReducedToStatements);

  for (const sql of sqlStatements) {
    await prisma.$executeRawUnsafe(sql);
  }
}

function splitStringByNotQuotedSemicolon(input: string): string[] {
  const result = [];

  let currentSplitIndex = 0;
  let isInString = false;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "'") {
      // toggle isInString
      isInString = !isInString;
    }
    if (input[i] === ';' && !isInString) {
      result.push(input.substring(currentSplitIndex, i + 1));
      currentSplitIndex = i + 2;
    }
  }

  return result;
}
