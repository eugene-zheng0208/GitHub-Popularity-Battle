// const id = 'YOUR_CLIENT_ID'
// const sec = 'YOUR_SECRET_ID'
// const params = `?client_id=${id}&client_secret=${sec}`

const getProfile = username => (
  // fetch(`https://api.github.com/users/${username}${params}`)
  fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json())
)

const getRepos = username => (
  // fetch(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
  fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    .then(res => res.json())
)

const getStarCount = repos => (
  repos.reduce((count, { stargazers_count }) => (
    count + stargazers_count
  ), 0)
)

const calculateScore = ({ followers }, repos) => (
  followers * 3 + getStarCount(repos)
)

const getUserData = player => (
  Promise.all([ getProfile(player), getRepos(player)])
    .then(([ profile, repos ]) => ({
      profile,
      score: calculateScore(profile, repos)
    }))
)

const sortPlayers = players => (
  players.sort((a, b) => b.score - a.score)
)

const handleError = error => {
  console.warn(error)
  return null
}

export const battle = players => (
  Promise.all(players.map(getUserData))
    .then(sortPlayers)
    .catch(handleError)
)

export const fetchPopularRepos = language => (
  fetch(window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`))
    .then(res => res.json())
    .then(data => data.items)
    .catch(handleError)
)
