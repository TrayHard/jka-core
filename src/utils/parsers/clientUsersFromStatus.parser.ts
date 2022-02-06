export interface IGetStatusClientUser {
  name: string,
  ping: string,
  score: string,
}

export function parseClientUsersFromStatus(strToParse: string): IGetStatusClientUser[] {
  const playersMatch = Array.from(strToParse.matchAll(/\n(\S+)\s(\S+)\s"(.*)"/g));
  if (!playersMatch) {
    throw new Error('Can\'t parse any userclients!')
  } else return playersMatch.map<IGetStatusClientUser>(
    match => ({
      score: match[1],
      ping: match[2],
      name: match[3],
    })
  )
}