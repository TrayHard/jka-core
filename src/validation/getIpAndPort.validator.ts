export function getIpAndPort(server: string): {
  ip: string, port: number,
} {
  const incorrectFormatErrorMessage =
  'Parameter "server" has incorrect format!\nRequired format: "server_ipv4_or_domainname:port"\ne.g. 242.9.9.9:29071 or server.com:30001';
  const array = server.split(':');
  if (array.length === 2) {
    // TODO: Add domain checker
    const [ip, port] = [array[0], parseInt(array[1])];
    if (typeof port !== 'number' || isNaN(port))
      throw new Error(incorrectFormatErrorMessage)
    else if (!(port > 0 && port < 65535))
      throw new Error('Port must be a number in range [1-65534]!')
    else return { ip, port };
  } else {
    throw new Error(incorrectFormatErrorMessage)
  }
}