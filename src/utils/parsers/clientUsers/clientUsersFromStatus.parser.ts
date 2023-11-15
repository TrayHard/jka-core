export type TGetStatusClientUser = {
  name: string,
  ping: string,
  score: string,
}

export function parseClientUsersFromStatus(strToParse: string): TGetStatusClientUser[] {
  const playersMatch = Array.from(strToParse.matchAll(/\n(\S+)\s(\S+)\s"(.*)"/g));
  if (!playersMatch) {
    throw new Error('Can\'t parse any userclients!')
  } else return playersMatch.map<TGetStatusClientUser>(
    match => ({
      score: match[1],
      ping: match[2],
      name: match[3],
    })
  )
}