import { createSocket } from 'dgram';
import { getIpAndPort } from '../validation/getIpAndPort.validator';
import { DEFAULT_REQUEST_TIMEOUT, MIN_REQUEST_TIMEOUT } from '../constants';

export type TBaseRequestParams = {
  server: string,
  request: string,
  timeout?: number,
}

/**
 *
 * @param params Object with keys:
 * request - request to the server,
 * ip - ip or domain name of the server
 * port - port (number 1-65534)
 * timeout - timer in secs after which request would be interrupted (min: 2, default: 10)
 * @returns string with server response or throws an error
 */
export const basicRequest = (params: TBaseRequestParams): Promise<string> => {
  const { ip, port, timeout, request } = validateAndParseInput(params);

  return new Promise<string>((resolve, reject) => {
    const packet = Buffer.from(`\xFF\xFF\xFF\xFF${request}`, 'latin1');
    const socket = createSocket('udp4');
    const msg: string[] = [];
    const listener = (response: Buffer) => msg.push(response.toString())
    const connection = socket.once('message', (response) => {
      msg.push(response.toString());
      // Coming below is required because response can come as a load of packets, not just one
      socket.on('message', listener);
      setTimeout(() => {
        connection.off('message', listener);
        resolve(msg.join(''));
      }, 2000);
    });
    socket.send(packet, 0, packet.length, port, ip);

    setTimeout(() => {
      connection.off('message', listener);
      reject('No response!')
    }, timeout * 1000);
  })
}

function validateAndParseInput (params: TBaseRequestParams): {
  ip: string, port: number, timeout: number, request: string,
} {
  const noParams = [];
  if (!params.server) noParams.push('server');
  if (!params.request) noParams.push('request');
  if (noParams.length > 0) throw new Error('Parameter "ip" is required!');
  if (params.timeout && params.timeout < MIN_REQUEST_TIMEOUT) throw new Error('Parameter "timeout" must be at least 1 second!');

  const { ip, port } = getIpAndPort(params.server)
  const timeout = params?.timeout || DEFAULT_REQUEST_TIMEOUT;
  return { ip, port, timeout, request: params.request };
}
