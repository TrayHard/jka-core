import { EGetStatusFields } from "../constants";
import { IGetStatusClientUser, parseClientUsersFromStatus } from "../utils/parsers/clientUsersFromStatus.parser";
import { EGetStatusParseValueType, parseCvarValueFromStatus } from "../utils/parsers/cvarValueFromStatus.parser";
import { basicRequest } from "./basic.request";

export type TGetStatusRawResponse = {
  cvars: Record<EGetStatusFields, string>,
  clients: IGetStatusClientUser[],
}

type TCvarsObject = {
  cvarName: EGetStatusFields,
  returnType: EGetStatusParseValueType,
}

export async function getStatusRaw(server: string, timeout?: number): Promise<TGetStatusRawResponse> {
  let strToParse = '';
  try {
    strToParse = await baseRequest({ request: 'getstatus', server, timeout })
  } catch (error) {
    console.error('GetStatus Request failed:');
    throw error;
  }
  strToParse = strToParse.replace(/����statusResponse\n/, '');

  const cvars: TCvarsObject[] = Object.values(EGetStatusFields).map((field) => ({
    cvarName: field as EGetStatusFields,
    returnType: field === EGetStatusFields.G_GAMETYPE
      ? EGetStatusParseValueType.GAMETYPE
      : EGetStatusParseValueType.STRING,
  }));

  return {
    cvars: processCvars(strToParse, cvars),
    clients: parseClientUsersFromStatus(strToParse),
  };
}

function processCvars(strToParse: string, cvars: TCvarsObject[]): Record<EGetStatusFields, string> {
  return cvars.reduce((acc, el) => ({
    ...acc,
    [el.cvarName]: parseCvarValueFromStatus(strToParse, el.cvarName, el.returnType),
  }), {} as Record<EGetStatusFields, string>);
}
