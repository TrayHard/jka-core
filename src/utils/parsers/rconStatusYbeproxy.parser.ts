import { EGametypes, EServerTypes } from "../..";
import { gametypeNumToNamesMapper } from "../mappers/gametype.mapper";
import { clientUsersFromRconStatusYbeproxy, IRconStatusYbeproxyClientUser } from "./clientUsersFromRconStatusYbeproxy.parser";

export interface IRconStatusYbeproxyResponse {
  type: EServerTypes.YBEPROXY
  hostname: string,
  ip: string,
  port: string,
  os: string,
  version: string,
  protocol: number,
  gamename: string,
  map: string,
  gametype: EGametypes,
  players: IRconStatusYbeproxyClientUser[],
}

export function rconStatusYbeproxyParser(strToParse: string): IRconStatusYbeproxyResponse {
  let lines = strToParse.split('\n');
  if (lines.length < 7) throw new Error('No information provided!');

  const clientsInfo: string[] = [];
  let hostname = '';
  let ip = '';
  let port = '';
  let os = '';
  let version = '';
  let protocol = 26;
  let gamename = '';
  let map = '';
  let gametype = EGametypes.DUEL;

  lines.map(line => {
    // Skip rubbish lines
    if (
      !line ||
      line.startsWith('-') ||
      line.startsWith('score') ||
      line.startsWith('players')
    ) return;

    if (line.startsWith('hostname')) {
      const match = line.match(/^hostname:\s(.+)\^7/)
      if (match) {
        hostname = match[1];
      }

    } else if (line.startsWith('server')) {
      const match = line.match(/^server\s{2}:\s([0-9\.]+):(\d{1,5}),\s(\S+),/)
      if (match) {
        ip = match[1];
        port = match[2];
        os = match[3];
      }

    } else if (line.startsWith('game')) {
      const match = line.match(/^game\s{4}:\s([0-9\.]+)\s(\d+),\s(\S+)/)
      if (match) {
        version = match[1];
        protocol = parseInt(match[2]);
        gamename = match[3];
      }

    } else if (line.startsWith('map')) {
      const match = line.match(/^map\s{5}:\s\^7(\S+)\^7, \S+\((\d)\)$/)
      if (match) {
        map = match[1];
        gametype = gametypeNumToNamesMapper(match[2]);
      }

    } else {
      clientsInfo.push(line)
    }
  })

  return {
    type: EServerTypes.YBEPROXY,
    hostname,
    ip,
    port,
    os,
    version,
    protocol,
    gamename,
    map,
    gametype,
    players: clientUsersFromRconStatusYbeproxy(clientsInfo),
  }
}