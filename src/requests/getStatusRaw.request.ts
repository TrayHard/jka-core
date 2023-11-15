import { getStatusRawParser, TGetStatusRawResponse } from "../utils/parsers/getStatus/getStatusRaw.parser";
import { basicRequest } from "./basic.request";

export async function getStatusRaw(server: string, timeout?: number): Promise<TGetStatusRawResponse> {
  let strToParse: string;
  try {
    strToParse = await basicRequest({ request: 'getstatus', server, timeout })
    return getStatusRawParser(strToParse);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`GetStatus Request failed:\n"${(error as Error).message}"`)
    } else {
      throw new Error(`GetStatus Request failed:\n${error}`)
    }
  }
}
