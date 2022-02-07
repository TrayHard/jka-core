import { EServerTypes } from "../..";
import { clientUsersFromRconStatusBase, IRconStatusBaseClientUser } from "./clientUsersFromRconStatusBase.parser";

export interface IRconStatusBaseResponse {
  type: EServerTypes.BASE
  map: string,
  players: IRconStatusBaseClientUser[],
}

export function rconStatusBaseParser(strToParse: string): IRconStatusBaseResponse {
  let lines = strToParse.split('\n');
  if (lines.length < 2) throw new Error('No information provided!');
  const clientsInfo: string[] = [];
  let map: string | null = '';
  lines.map(line => {
    if (!line || line.startsWith('-') || line.startsWith('num')) return;
    if (line.startsWith('map')) {
      const match = line.match(/map:\s(.+)/)
      map = match ? match[1] : null;
    } else clientsInfo.push(line)
  })

  return {
    type: EServerTypes.BASE,
    map,
    players: clientUsersFromRconStatusBase(clientsInfo),
  }
}