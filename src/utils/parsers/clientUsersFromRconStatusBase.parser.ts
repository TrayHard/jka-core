export interface IRconStatusBaseClientUser {
  id: number,
  score: number | null,
  ping: number | null,
  name: string | null,
  lastmsg: number | null,
  address: string | null,
  isBot: boolean,
  qport: number | null,
  rate: number | null,
}

export function clientUsersFromRconStatusBase(clientsInfoStrArray: string[]): IRconStatusBaseClientUser[] {

  return clientsInfoStrArray.map(line => {
    const id = parseInt(line.slice(0, 3).trim());
    const score = parseInt(line.slice(4, 9).trim());
    const isBot = line.slice(39, 60).trim() === 'bot';
    const ping = isBot
      ? null
      : parseInt(line.slice(10, 14).trim()) ?? null;
    const name = line.slice(15, 30).trim() ?? null;
    const lastmsg = parseInt(line.slice(31, 38).trim()) ?? null;
    const address = isBot
      ? null
      : line.slice(39, 60).trim();
    const qport = parseInt(line.slice(61, 66).trim()) ?? null;
    const rate = parseInt(line.slice(67, 72).trim()) ?? null;

    return {
      id,
      name,
      address,
      isBot,
      ping,
      score,
      qport,
      rate,
      lastmsg,
    }
  })
}