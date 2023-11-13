export const errors = {
    incorrectFormatErrorMessage: 'Parameter "server" has incorrect format!\nRequired format: "server_ipv4_or_domainname:port"\ne.g. 242.9.9.9:29071 or server.com:30001',
};

export function getIpAndPort(server: string): {
    ip: string, port: number,
} {
    const array = server.split(':');
    if (array.length === 2) {
        // TODO: Add domain checker
        const [ip, port] = [array[0], parseInt(array[1])];
        if (isValidIp(ip) && isValidPort(port)) return { ip, port }
        else throw new Error(errors.incorrectFormatErrorMessage)
    } else {
        throw new Error(errors.incorrectFormatErrorMessage)
    }
}

function isValidIp(candidate: unknown) {
    if (typeof candidate !== 'string') return false;

    if (candidate === 'localhost') return true;

    // IPv4
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(candidate))
        return true;

    // domains
    if (/^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/.test(candidate))
        return true;

    return false;
}

function isValidPort(candidate: unknown) {
    if (typeof candidate !== 'number' || isNaN(candidate)) return false;
    if (!(candidate > 0 && candidate < 65535)) return false;
    return true
}
