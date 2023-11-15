import { EGametypes, EServerTypes } from "../../../index";
import { gametypeNumToNamesMapper } from "../../mappers/gametype.mapper";
import {
  clientUsersFromRconStatusOpenjk,
  TRconStatusOpenjkClientUser
} from "../clientUsers/clientUsersFromRconStatusOpenjk.parser";

export type TRconStatusOpenjkResponse = {
  type: EServerTypes.OPENJK
  hostname: string,
  ip: string,
  port: string,
  os: string,
  version: string,
  protocol: string,
  gamename: string,
  map: string,
  uptime: string,
  gametype: EGametypes,
  players: TRconStatusOpenjkClientUser[],
}

export function rconStatusOpenjkParser(strToParse: string): TRconStatusOpenjkResponse {
  let lines = strToParse.split('\n');
  if (lines.length < 9) throw new Error('No information provided!');

  const clientsInfo: string[] = [];
  let hostname = '';
  let version = '';
  let protocol = '26';
  let gamename = '';
  let ip = '';
  let os = '';
  let map = '';
  let port = '';
  let uptime = '';
  let gametype = EGametypes.DUEL;

  lines.map(line => {
    // Skip rubbish lines
    if (
      !line ||
      line.startsWith('players') ||
      line.startsWith('-') ||
      line.startsWith('cl ')
    ) return;

    if (line.startsWith('hostname')) {

      const match = line.match(/^hostname\s*:\s(.+)\^7$/)
      if (match) {
        hostname = match[1];
      }

    } else if (line.startsWith('version')) {

      const match = line.match(/^version\s*:\s(.+) (\d+)$/)
      if (match) {
        version = match[1];
        protocol = match[2];
      }

    } else if (line.startsWith('udp/ip')) {

      const match = line.match(/^udp\/ip\s*:\s([0-9\.]+):(\d+)\sos\((\S+)\) .+$/)
      if (match) {
        ip = match[1];
        port = match[2];
        os = match[3];
      }

    } else if (line.startsWith('game')) {

      const match = line.match(/^game\s+:\s(.+)$/)
      if (match) {
        gamename = match[1];
      }

    } else if (line.startsWith('uptime')) {

      const match = line.match(/^uptime\s+:\s(\S+)$/)
      if (match) {
        uptime = match[1]
      }

    } else if (line.startsWith('map')) {

      const match = line.match(/^map\s+:\s(\S+) gametype\((\d)\)$/)
      if (match) {
        map = match[1];
        gametype = gametypeNumToNamesMapper(match[2]);
      }

    } else {
      clientsInfo.push(line)
    }
  })

  return {
    type: EServerTypes.OPENJK,
    hostname,
    ip,
    port,
    os,
    version,
    protocol,
    gamename,
    map,
    uptime,
    gametype,
    players: clientUsersFromRconStatusOpenjk(clientsInfo),
  }
}
