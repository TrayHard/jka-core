import { TRconStatusYbeproxyClientUser } from "./clientUsersFromRconStatusYbeproxy.parser";

export type TRconStatusJaproClientUser = TRconStatusYbeproxyClientUser;

export function clientUsersFromRconStatusJapro(clientsInfoStrArray: string[]): TRconStatusJaproClientUser[] {
  return clientsInfoStrArray.map(line => {
    const id = parseInt(line.slice(0, 2).trim());
    const score = parseInt(line.slice(3, 8).trim());
    const isBot = line.slice(20, 42).trim() === 'bot';
    const ping = isBot
      ? null
      : parseInt(line.slice(9, 13).trim()) ?? null;
    const rate = parseInt(line.slice(14, 19).trim()) ?? null;
    const address = isBot
      ? null
      : line.slice(20, 42).trim();
    const name = line.slice(43, -2).trim() ?? null;

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