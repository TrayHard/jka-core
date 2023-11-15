export type TRconStatusOpenjkClientUser = {
  id: number,
  name: string,
  address: string | null,
  isBot: boolean,
  score: number,
  ping: number | null,
  rate: number,
}

export function clientUsersFromRconStatusOpenjk(clientsInfoStrArray: string[]): TRconStatusOpenjkClientUser[] {
  return clientsInfoStrArray.map(line => {
    const match = line.match(/^\s*(\d+)\s+(\d+)\s+(\d+)\s(.{15})\s\^7\s+(\S+)\s(\d+)$/);
    if (!match) throw new Error('Parsing errors for clientsInfo');

    const id = parseInt(match[1]);
    const score = parseInt(match[2]);
    const ping = parseInt(match[3]);
    const name = match[4];

    const isBot = match[5] === 'bot';
    const address = isBot ? null : match[5];
    const rate = parseInt(match[6]);

    return {
      id,
      name,
      address,
      isBot,
      ping,
      score,
      rate,
    }
  })
}
