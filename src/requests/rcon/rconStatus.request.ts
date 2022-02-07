import { EGametypes, EServerTypes } from "../..";
import { IRconStatusBaseClientUser } from "../../utils/parsers/clientUsersFromRconStatusBase.parser";
import { IRconStatusYbeproxyClientUser } from "../../utils/parsers/clientUsersFromRconStatusYbeproxy.parser";
import { rconStatusBaseParser } from "../../utils/parsers/rconStatusBase.parser";
import { rconStatusYbeproxyParser } from "../../utils/parsers/rconStatusYbeproxy.parser";
import { rconBasicRequest } from "../rconBasic.request";

export type TRconStatusResponse = {
  type: EServerTypes.BASE
  map: string,
  players: IRconStatusBaseClientUser[],
} | {
  type: EServerTypes.YBEPROXY
  hostname: string,
  ip: string,
  port: string,
  os: string,
  version: string,
  protocol: number,
  gamename: string,
  map: string,
  gametype: EGametypes,
  players: IRconStatusYbeproxyClientUser[],
} | {
  type: EServerTypes.JAPRO
  hostname: string,
  ip: string,
  port: string,
  version: string,
  protocol: number,
  gamename: string,
  map: string,
  gametype: EGametypes,
  uptime: string,
  players: IRconStatusJaproClientUser[],
}


export interface IRconStatusJaproClientUser extends IRconStatusYbeproxyClientUser {}

export async function rconStatus(server: string, rconpassword: string, timeout?: number): Promise<TRconStatusResponse> {
  let strToParse = '';
  try {
    strToParse = await rconBasicRequest({ cmd: 'status', server, rconpassword, timeout })
  } catch (error) {
    console.error('RconStatus Request failed:');
    throw error;
  }
  const serverType = defineTheServerType(strToParse);
  switch (serverType) {
    case EServerTypes.BASE:
      return rconStatusBaseParser(strToParse);
    case EServerTypes.JAPRO:
      return rconStatusBaseParser(strToParse);
    case EServerTypes.YBEPROXY:
      return rconStatusYbeproxyParser(strToParse);
    default:
      throw new Error('Unknown server type!')
  }
}

function defineTheServerType(strToCheck: string): EServerTypes {
  let lines = strToCheck.split('\n');
  if (lines.length < 2) throw new Error('No information provided!')
  lines = lines.filter(x => x !== '');
  if (!lines.some(line => line.startsWith('hostname'))) {
    return EServerTypes.BASE
  } else if (lines.some(line => line.startsWith('uptime'))) {
    return EServerTypes.JAPRO
  } else {
    return EServerTypes.YBEPROXY
  }
}