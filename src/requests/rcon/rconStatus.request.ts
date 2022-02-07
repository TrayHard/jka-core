import { EServerTypes } from "../..";
import { IRconStatusBaseResponse, rconStatusBaseParser } from "../../utils/parsers/rconStatusBase.parser";
import { IRconStatusJaproResponse, rconStatusJaproParser } from "../../utils/parsers/rconStatusJapro.parser";
import { IRconStatusYbeproxyResponse, rconStatusYbeproxyParser } from "../../utils/parsers/rconStatusYbeproxy.parser";
import { rconBasicRequest } from "../rconBasic.request";

export type TRconStatusResponse =
  IRconStatusBaseResponse |
  IRconStatusYbeproxyResponse |
  IRconStatusJaproResponse

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
      return rconStatusJaproParser(strToParse);
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