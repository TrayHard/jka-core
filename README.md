# JKA Core
Library for working with Jedi Academy servers

## Install

```
npm i jka-core
```

## To do:
- [ ] `rcon` request
- [ ] `getInfo` request
- [ ] ... any ideas? Write me in Discord: `Tray#0219`

## Current features
What you can do right now:

1. You can make UDP requests and get the JSON formatted raw response with `getStatusRaw`
```js
const response = await getStatusRaw('rujka.ru:29070') // or '37.230.210.176:29070'

response = {
  cvars: {
    sv_hostname: 'RU^1JKA^0|^1T^7ls^1Red',
    sv_maxclients: '32',
    mapname: 'mp/duel1',
    timelimit: '3',
    fraglimit: '1',
    duel_fraglimit: '10',
    g_gametype: 'DUEL',
    g_debugmelee: '0',
    g_maxGameClients: '6',
    sv_privateClients: '0',
    gamename: 'basejka',
    version: 'JAmp: v1.0.1.1 linux-i386 Nov 10 2003',
    g_forcepowerdisable: '163837',
    g_weapondisable: '524279',
    g_duelWeaponDisable: '524279',
    g_jediVmerc: '0',
    g_siegeTeam1: 'none',
    g_siegeTeam2: 'none',
    g_siegeTeamSwitch: '1',
    g_siegeRespawn: '20',
    g_stepslidefix: '1',
    g_saberwalldamagescale: '0.4',
    g_forceregentime: '200',
    bg_fighteraltcontrol: '0',
    sv_allowDownload: '0',
    sv_floodProtect: '1',
    sv_maxPing: '0',
    sv_minPing: '0',
    sv_maxRate: '25000',
    g_needpass: '1',
    g_forceBasedTeams: '0',
    g_maxForceRank: '7',
    g_saberLocking: '0',
    g_privateDuel: '0',
    capturelimit: '0',
    dmflags: '0',
    g_maxHolocronCarry: '3',
    protocol: '26',
    bot_minplayers: '0',
    g_noSpecMove: '0',
    g_allowNPC: '1',
    g_showDuelHealths: '0'
  },
  clients: [ { score: '0', ping: '12', name: '[AFK]^2� ^1RU^7JKA^1.Airlines' } ]
}
```
2. You can use `getStatusSmart` which is same getstatus request but with some post-processing:

```js
const response = await getStatusSmart('rujka.ru:29070') // or '37.230.210.176:29070'

response === {
    cvars: {
    sv_hostname: 'RU^1JKA^0|^1T^7ls^1Red',
    mapname: 'mp/duel1',
    g_gametype: 'DUEL',
    g_siegeTeam1: 'none',
    g_siegeTeam2: 'none',
    gamename: 'basejka',
    sv_maxclients: 32,
    timelimit: 3,
    fraglimit: 1,
    duel_fraglimit: 10,
    g_maxGameClients: 6,
    g_siegeRespawn: 20,
    g_forceregentime: 200,
    sv_maxPing: 0,
    sv_minPing: 0,
    sv_maxRate: 25000,
    g_maxForceRank: 7,
    capturelimit: 0,
    dmflags: 0,
    g_maxHolocronCarry: 3,
    protocol: 26,
    sv_privateClients: 0,
    bot_minplayers: 0,
    g_saberwalldamagescale: 0.4,
    g_debugmelee: false,
    g_jediVmerc: false,
    g_siegeTeamSwitch: true,
    g_stepslidefix: true,
    sv_allowDownload: false,
    sv_floodProtect: true,
    g_needpass: true,
    g_forceBasedTeams: false,
    g_privateDuel: false,
    g_noSpecMove: false,
    g_allowNPC: true,
    g_showDuelHealths: false,
    g_forcepowerdisable: Bitfield { _bits: [Array], _keys: [Array] },
    g_weapondisable: Bitfield { _bits: [Array], _keys: [Array] },
    g_duelWeaponDisable: Bitfield { _bits: [Array], _keys: [Array] }
  },
  clients: [
    {
      name: '[AFK]^2� ^1RU^7JKA^1.Airlines',
      ping: 11,
      score: 0,
      isBot: false
    }
  ]
}
```

3. Class `Bitfield` which allows you to easily work with bitfield values, print them with specified descriptions and change that values as you need:

```js
// Let's define keys for our bitfield
const WEAPON_DISABLE_VALUES = [
  'NO_WEAPON',
  'STUN_BATON',
  'MELEE',
  'SABER',
  'BRYAR_PISTOL',
  'BLASTER',
  'DISRUPTOR',
  'BOWCASTER',
  'REPEATER',
  'DEMP2',
  'FLECHETTE',
  'ROCKET_LAUNCHER',
  'THERMAL',
  'TRIP_MINE',
  'DET_PACK',
  'CONCUSSION',
  'BRYAR_OLD',
  'EMPLACED_GUN',
  'TURRET',
]

const gWeaponDisable = new Bitfield(
  524279, // decimal value which you can get from the server
  WEAPON_DISABLE_VALUES.length, // number of entities to control with this bitfield
  WEAPON_DISABLE_VALUES, // keys which would be printed in output list
)

// gWeaponDisable.decimal:
524279

// gWeaponDisable.binary:
'1111111111111110111'

// gWeaponDisable.list:
{
  TURRET: true,
  EMPLACED_GUN: true,
  BRYAR_OLD: true,
  CONCUSSION: true,
  DET_PACK: true,
  TRIP_MINE: true,
  THERMAL: true,
  ROCKET_LAUNCHER: true,
  FLECHETTE: true,
  DEMP2: true,
  REPEATER: true,
  BOWCASTER: true,
  DISRUPTOR: true,
  BLASTER: true,
  BRYAR_PISTOL: true,
  SABER: false,
  MELEE: true,
  STUN_BATON: true,
  NO_WEAPON: true
}

// gWeaponDisable.get('BLASTER'):
true

// gWeaponDisable.set('BLASTER', false):
true // means the value has been successfully set, otherwise it would be false

// gWeaponDisable.get('RANDOM TEXT'):
null
```
