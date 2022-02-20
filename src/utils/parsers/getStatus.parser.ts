import { parseBooleanOtherwiseNull, parseFloatOtherwiseNull, parseIntOtherwiseNull } from "..";
import { Bitfield, EGetStatusFields, FORCEPOWER_DISABLE_VALUES, WEAPON_DISABLE_VALUES } from "../..";
import { TGetStatusClientUser } from "./clientUsersFromStatus.parser";
import { getStatusRawParser } from "./getStatusRaw.parser";

type TCvarsSmart = {
  [EGetStatusFields.SV_HOSTNAME]: string,
  [EGetStatusFields.SV_MAXCLIENTS]: number,
  [EGetStatusFields.MAPNAME]: string,
  [EGetStatusFields.TIMELIMIT]: number,
  [EGetStatusFields.FRAGLIMIT]: number,
  [EGetStatusFields.DUEL_FRAGLIMIT]: number,
  [EGetStatusFields.G_GAMETYPE]: string,
  [EGetStatusFields.G_DEBUGMELEE]: boolean,
  [EGetStatusFields.G_MAX_GAME_CLIENTS]: boolean,
  [EGetStatusFields.GAMENAME]: string,
  [EGetStatusFields.VERSION]: number,
  [EGetStatusFields.G_FORCEPOWERDISABLE]: {
    value: number,
    togglers: {

    }
  },
  [EGetStatusFields.G_WEAPONDISABLE]: {
    value: number,
    togglers: {

    }
  },
  [EGetStatusFields.G_DUEL_WEAPON_DISABLE]: {
    value: number,
    togglers: {

    }
  },
  [EGetStatusFields.G_JEDI_VMERC]: boolean,
  [EGetStatusFields.G_SIEGE_TEAM1]: string,
  [EGetStatusFields.G_SIEGE_TEAM2]: string,
  [EGetStatusFields.G_SIEGE_TEAM_SWITCH]: boolean,
  [EGetStatusFields.G_SIEGE_RESPAWN]: number,
  [EGetStatusFields.G_STEPSLIDEFIX]: boolean,
  [EGetStatusFields.G_SABERWALLDAMAGESCALE]: number,
  [EGetStatusFields.G_FORCEREGENTIME]: number,
  [EGetStatusFields.BG_FIGHTERALTCONTROL]: number,
  [EGetStatusFields.SV_ALLOW_DOWNLOAD]: boolean,
  [EGetStatusFields.SV_FLOOD_PROTECT]: boolean,
  [EGetStatusFields.SV_MAX_PING]: number,
  [EGetStatusFields.SV_MIN_PING]: number,
  [EGetStatusFields.SV_MAX_RATE]: number,
  [EGetStatusFields.G_NEEDPASS]: boolean,
  [EGetStatusFields.G_FORCE_BASED_TEAMS]: boolean,
  [EGetStatusFields.G_MAX_FORCE_RANK]: number,
  [EGetStatusFields.G_SABER_LOCKING]: boolean,
  [EGetStatusFields.G_PRIVATE_DUEL]: boolean,
  [EGetStatusFields.CAPTURELIMIT]: number,
  [EGetStatusFields.DMFLAGS]: number,
  [EGetStatusFields.G_MAX_HOLOCRON_CARRY]: number,
  [EGetStatusFields.PROTOCOL]: number,
  [EGetStatusFields.SV_PRIVATE_CLIENTS]: number,
  [EGetStatusFields.BOT_MINPLAYERS]: number,
  [EGetStatusFields.G_NO_SPEC_MOVE]: boolean,
  [EGetStatusFields.G_ALLOW_NPC]: boolean,
  [EGetStatusFields.G_SHOW_DUEL_HEALTHS]: boolean,
}

export type TGetStatusSmartResponse = {
  cvars: TCvarsSmart,
  clients: TGetStatusClientUser[],
}

const cvarsTypeHashMap: {
  [key: string]: Array<keyof TCvarsSmart>
} = {
  str: [
    EGetStatusFields.SV_HOSTNAME,
    EGetStatusFields.MAPNAME,
    EGetStatusFields.G_GAMETYPE,
    EGetStatusFields.G_SIEGE_TEAM1,
    EGetStatusFields.G_SIEGE_TEAM2,
    EGetStatusFields.GAMENAME,
  ],
  strToInt: [
    EGetStatusFields.SV_MAXCLIENTS,
    EGetStatusFields.TIMELIMIT,
    EGetStatusFields.FRAGLIMIT,
    EGetStatusFields.DUEL_FRAGLIMIT,
    EGetStatusFields.G_MAX_GAME_CLIENTS,
    EGetStatusFields.G_SIEGE_RESPAWN,
    EGetStatusFields.G_FORCEREGENTIME,
    EGetStatusFields.SV_MAX_PING,
    EGetStatusFields.SV_MIN_PING,
    EGetStatusFields.SV_MAX_RATE,
    EGetStatusFields.G_MAX_FORCE_RANK,
    EGetStatusFields.CAPTURELIMIT,
    EGetStatusFields.DMFLAGS,
    EGetStatusFields.G_MAX_HOLOCRON_CARRY,
    EGetStatusFields.PROTOCOL,
    EGetStatusFields.SV_PRIVATE_CLIENTS,
    EGetStatusFields.BOT_MINPLAYERS,
  ],
  strToFloat: [
    EGetStatusFields.G_SABERWALLDAMAGESCALE,
  ],
  bitfields: [
    EGetStatusFields.G_FORCEPOWERDISABLE,
    EGetStatusFields.G_WEAPONDISABLE,
    EGetStatusFields.G_DUEL_WEAPON_DISABLE,
  ],
  booleans: [
    EGetStatusFields.G_DEBUGMELEE,
    EGetStatusFields.G_JEDI_VMERC,
    EGetStatusFields.G_SIEGE_TEAM_SWITCH,
    EGetStatusFields.G_STEPSLIDEFIX,
    EGetStatusFields.SV_ALLOW_DOWNLOAD,
    EGetStatusFields.SV_FLOOD_PROTECT,
    EGetStatusFields.G_NEEDPASS,
    EGetStatusFields.G_FORCE_BASED_TEAMS,
    EGetStatusFields.G_PRIVATE_DUEL,
    EGetStatusFields.G_NO_SPEC_MOVE,
    EGetStatusFields.G_ALLOW_NPC,
    EGetStatusFields.G_SHOW_DUEL_HEALTHS,
  ],
}

export function getStatusParser(strToParse: string): TGetStatusSmartResponse  {
  const getStatusRawParsed = getStatusRawParser(strToParse)

  let result: any = {
    cvars: {},
    clients: [],
  };
  cvarsTypeHashMap.str.forEach((field) => {
    result.cvars[field] = getStatusRawParsed.cvars[field];
  })
  cvarsTypeHashMap.strToInt.forEach((field) => {
    result.cvars[field] = parseIntOtherwiseNull(getStatusRawParsed.cvars[field]);
  })
  cvarsTypeHashMap.strToFloat.forEach((field) => {
    result.cvars[field] = parseFloatOtherwiseNull(getStatusRawParsed.cvars[field]);
  })
  cvarsTypeHashMap.booleans.forEach((field) => {
    result.cvars[field] = parseBooleanOtherwiseNull(getStatusRawParsed.cvars[field]);
  })

  result.cvars[EGetStatusFields.G_FORCEPOWERDISABLE]
    = new Bitfield(
      parseInt(getStatusRawParsed.cvars[EGetStatusFields.G_FORCEPOWERDISABLE]),
      FORCEPOWER_DISABLE_VALUES.length,
      FORCEPOWER_DISABLE_VALUES
    )
  result.cvars[EGetStatusFields.G_WEAPONDISABLE]
    = new Bitfield(
      parseInt(getStatusRawParsed.cvars[EGetStatusFields.G_WEAPONDISABLE]),
      WEAPON_DISABLE_VALUES.length,
      WEAPON_DISABLE_VALUES
    )
  result.cvars[EGetStatusFields.G_DUEL_WEAPON_DISABLE]
    = new Bitfield(
      parseInt(getStatusRawParsed.cvars[EGetStatusFields.G_WEAPONDISABLE]),
      WEAPON_DISABLE_VALUES.length,
      WEAPON_DISABLE_VALUES
    )

  result.clients = getStatusRawParsed.clients.map((el) => ({
    name: el.name,
    ping: parseIntOtherwiseNull(el.ping),
    score: parseIntOtherwiseNull(el.score),
    isBot: parseIntOtherwiseNull(el.ping) === 0,
  }))

  return result;
}
