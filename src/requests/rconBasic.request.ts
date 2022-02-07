import { basicRequest } from "./basic.request";

export interface IRconBaseRequestParams {
  server: string,
  rconpassword: string,
  cmd: string,
  timeout?: number,
}

const ERRORS = {
  INCORRECT_PASSWORD: 'Incorrect rconpassword!',
  INVALID_PASSWORD_FORMAT: 'Invalid rconpassword format! It must be a string without any whitespaces within!',
  INVALID_CMD_FORMAT: 'Invalid rcon command format! It must be a string!',
}

export async function rconBasicRequest(params: IRconBaseRequestParams): Promise<string> {
  // TODO: Add input validation
  const { server, rconpassword, cmd, timeout } = parseAndValidate(params);
  let response = '';
  try {
    response = await basicRequest({ request: `rcon ${rconpassword} ${cmd}`, server, timeout });
  } catch (error) {
    console.error('Rcon Request failed:');
    throw error;
  }
  response = response.replaceAll(/����print\n/g, '');

  if (response.trim() === 'Bad rconpassword.') throw new Error(ERRORS.INCORRECT_PASSWORD);

  return response;
}

function parseAndValidate(params: IRconBaseRequestParams) {
  let { cmd, rconpassword, server, timeout } = params;
  if (typeof rconpassword === 'string') {
    rconpassword = rconpassword.trim();
    if (/\s/g.test(rconpassword)) {
      // Should not have any whitespaces within
      throw new Error(ERRORS.INVALID_PASSWORD_FORMAT);
    }
  } else throw new Error(ERRORS.INVALID_PASSWORD_FORMAT);

  if (typeof cmd === 'string') {
    cmd = cmd.trim();
  } else throw new Error(ERRORS.INVALID_PASSWORD_FORMAT);

  return {
    server, // validated in baseRequest
    timeout, // validated in baseRequest
    rconpassword,
    cmd,
  }
}