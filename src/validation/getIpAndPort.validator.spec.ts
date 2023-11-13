import { getIpAndPort } from "./getIpAndPort.validator";

describe('getIpAndPort', () => {
    test('gets ip and port correctly', () => {
        expect(getIpAndPort("123.123.123.123:29070")).toStrictEqual({
            ip: "123.123.123.123",
            port: 29070,
        });
    });
    test('works for domain names', () => {
        expect(getIpAndPort("server.com:30001")).toStrictEqual({
            ip: "server.com",
            port: 30001,
        });
    })
    test('works for subdomain names', () => {
        expect(getIpAndPort("subdomain.server.com:30002")).toStrictEqual({
            ip: "subdomain.server.com",
            port: 30002,
        });
    })
    test('works for localhost', () => {
        expect(getIpAndPort("localhost:30003")).toStrictEqual({
            ip: "localhost",
            port: 30003,
        });
    })
    test('works for short domains', () => {
        expect(getIpAndPort("li.com:30004")).toStrictEqual({
            ip: "li.com",
            port: 30004,
        });
    })
    test('fails for wrong format', () => {
        expect(() => getIpAndPort("com:30005")).toThrow();
        expect(() => getIpAndPort(".com:30007")).toThrow();
        // TODO: to make this test work (ips with 255+ octets)
        // expect(() => getIpAndPort("256.378.123.123:30008")).toThrow();
        expect(() => getIpAndPort("123.123.123.123:port")).toThrow();
        expect(() => getIpAndPort("123.123.123.123:999999")).toThrow();
        expect(() => getIpAndPort("123.123.123.123:-2")).toThrow();
    })
})

