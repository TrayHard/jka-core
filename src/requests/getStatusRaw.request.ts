import { getStatusRawParser, TGetStatusRawResponse } from "../utils/parsers/getStatusRaw.parser";
import { basicRequest } from "./basic.request";

export async function getStatusRaw(server: string, timeout?: number): Promise<TGetStatusRawResponse> {
  let strToParse: string;
  try {
    strToParse = await basicRequest({ request: 'getstatus', server, timeout })
    return getStatusRawParser(strToParse);
  } catch (error) {
    throw new Error(`GetStatus Request failed:\n"${(error as Error).message}"`)
  }
}
