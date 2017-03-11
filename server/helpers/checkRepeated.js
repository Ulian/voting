exports.isOptionRepeated = (options, option) => {
  return !(options.find(item => item.name === option) === undefined)
}

exports.isVoteRepeated = (options, user, ip) => {
  let found = false
  options.every(option => {
    option.votes.every(vote => {
      found = (vote.voter === user && vote.voter !== undefined) || vote.ip_address === ip
      return !found
    })
    return !found
  })
  return found
}
