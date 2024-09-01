import { EServerTypes } from "../..";
import { TRconStatusBaseResponse, rconStatusBaseParser } from "../../utils/parsers/rconStatus/rconStatusBase.parser";
import { TRconStatusJaproResponse, rconStatusJaproParser } from "../../utils/parsers/rconStatus/rconStatusJapro.parser";
import { TRconStatusYbeproxyResponse, rconStatusYbeproxyParser } from "../../utils/parsers/rconStatus/rconStatusYbeproxy.parser";
import { rconBasicRequest } from "./rconBasic.request";
import {
  rconStatusOpenjkParser,
  TRconStatusOpenjkResponse
} from "../../utils/parsers/rconStatus/rconStatusOpenjk.parser";

export type TRconStatusResponse =
  TRconStatusBaseResponse |
  TRconStatusYbeproxyResponse |
  TRconStatusOpenjkResponse |
  TRconStatusJaproResponse

export async function rconStatus(server: string, rconpassword: string, timeout?: number): Promise<TRconStatusResponse> {
  let strToParse = '';
  try {
    strToParse = await rconBasicRequest({ cmd: 'status', server, rconpassword, timeout })
  } catch (error) {
    console.error('RconStatus Request failed:');
    console.error(error);
    throw error;
  }
  const serverType = defineTheServerType(strToParse);
  switch (serverType) {
    case EServerTypes.BASE:
      return rconStatusBaseParser(strToParse);
    case EServerTypes.JAPRO:
      return rconStatusJaproParser(strToParse);
    case EServerTypes.YBEPROXY:
      return rconStatusYbeproxyParser(strToParse);
    case EServerTypes.OPENJK:
      return rconStatusOpenjkParser(strToParse);
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
  } else if (lines.some(line => line.startsWith('version'))) {
    return EServerTypes.OPENJK
  } else {
    return EServerTypes.YBEPROXY
  }
}
