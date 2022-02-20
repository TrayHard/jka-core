import { getStatusParser, TGetStatusSmartResponse } from "../utils/parsers/getStatus.parser";
import { basicRequest } from "./basic.request";

export async function getStatusSmart(server: string, timeout?: number): Promise<TGetStatusSmartResponse> {
  let strToParse: string;
  try {
    strToParse = await basicRequest({ request: 'getstatus', server, timeout })
    return getStatusParser(strToParse);
  } catch (error) {
    throw new Error(`GetStatus Request failed:\n"${(error as Error).message}"`)
  }
}
