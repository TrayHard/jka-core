export type TRconStatusYbeproxyClientUser = {
  id: number,
  name: string,
  address: string | null,
  isBot: boolean,
  score: number,
  ping: number | null,
  rate: number,
}

export function clientUsersFromRconStatusYbeproxy(clientsInfoStrArray: string[]): TRconStatusYbeproxyClientUser[] {
  return clientsInfoStrArray.map(line => {
    const score = parseInt(line.slice(0, 5).trim());
    const isBot = line.slice(18, 40).trim() === 'bot';
    const ping = isBot
      ? null
      : parseInt(line.slice(6, 10).trim()) ?? null;
    const rate = parseInt(line.slice(11, 17).trim()) ?? null;
    const address = isBot
      ? null
      : line.slice(18, 40).trim();
    const id = parseInt(line.slice(41, 43).trim());
    const name = line.slice(44, -2).trim() ?? null;

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