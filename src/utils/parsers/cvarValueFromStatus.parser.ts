import { gametypeNumToNamesMapper } from "../mappers/gametype.mapper";

export enum EGetStatusParseValueType {
  STRING = 'string',
  NUMBER = 'number',
  GAMETYPE = 'gametype',
}

export function parseCvarValueFromStatus(strToParse: string, cvarName: string, type: EGetStatusParseValueType): string | number | null {
  const match = strToParse.match(new RegExp(`${cvarName}\\\\(.+?)\[\\\\\\n\]`));
  if (!match) return null
  const result = match[1];
  switch (type) {
    case EGetStatusParseValueType.STRING:
      return result;
    case EGetStatusParseValueType.NUMBER:
      return isNaN(parseInt(result)) ? 0 : parseInt(result);
    case EGetStatusParseValueType.GAMETYPE:
      return gametypeNumToNamesMapper(result);
    default:
      throw new Error(`Incorrect result type provided! Must be one of these: ${Object.values(EGetStatusParseValueType)}`)
  }
}