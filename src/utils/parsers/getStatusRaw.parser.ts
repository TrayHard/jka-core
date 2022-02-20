import { EGetStatusFields } from "../..";
import { parseClientUsersFromStatus, TGetStatusClientUser } from "./clientUsersFromStatus.parser";
import { EGetStatusParseValueType, parseCvarValueFromStatus } from "./cvarValueFromStatus.parser";

export type TGetStatusRawResponse = {
  cvars: Record<EGetStatusFields, string>,
  clients: TGetStatusClientUser[],
}

type TCvarsObject = {
  cvarName: EGetStatusFields,
  returnType: EGetStatusParseValueType,
}

export function getStatusRawParser(strToParse: string) {
  const str = strToParse.replace(/����statusResponse\n/, '');

  const cvars: TCvarsObject[] = Object.values(EGetStatusFields).map((field) => ({
    cvarName: field as EGetStatusFields,
    returnType: field === EGetStatusFields.G_GAMETYPE
      ? EGetStatusParseValueType.GAMETYPE
      : EGetStatusParseValueType.STRING,
  }));

  return {
    cvars: processCvars(str, cvars),
    clients: parseClientUsersFromStatus(str),
  };
}

function processCvars(strToParse: string, cvars: TCvarsObject[]): Record<EGetStatusFields, string> {
  return cvars.reduce((acc, el) => ({
    ...acc,
    [el.cvarName]: parseCvarValueFromStatus(strToParse, el.cvarName, el.returnType),
  }), {} as Record<EGetStatusFields, string>);
}
