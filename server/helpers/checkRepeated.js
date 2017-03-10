exports.option = (options, option) => {
  let repeated = -1
  options.forEach((item, index) => {
    if (item.name === option) {
      repeated = index
      return 1
    }
  })
  return repeated
}

exports.vote = (options, user, ip) => {
  let repeated = -1
  options.forEach(option => {
    option.votes.forEach((vote, index) => {
      if ((vote.voter === user && vote.voter !== null) || vote.ip_address === ip) {
        repeated = index
        return 1
      }
    })
  })
  return repeated
}
