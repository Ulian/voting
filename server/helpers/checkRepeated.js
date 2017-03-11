exports.isOptionRepeated = (options, option) => {
  return !(options.find(item => item.name === option) === undefined)
}

exports.isVoteRepeated = (options, user, ip) => {
  let found = 0
  options.every(option => {
    found = !(option.votes.find(vote => (vote.voter === user && vote.voter !== undefined) || vote.ip_adress === ip) === undefined)
    return !found
  })
  return found
}
