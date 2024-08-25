import { getStatusParser } from "../utils/parsers";
import { basicRequest } from "./basic.request";

export async function getPlayersNumRequest(server: string, timeout?: number): Promise<number> {
	try {
		let strToParse = await basicRequest({ request: 'getstatus', server, timeout })
		return getStatusParser(strToParse).clients.length;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`GetStatus Request failed:\n"${(error as Error).message}"`)
		} else {
			throw new Error(`GetStatus Request failed:\n${error}`)
		}
	}
}
