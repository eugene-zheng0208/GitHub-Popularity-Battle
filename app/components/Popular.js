import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as api from '../utils/api'
import Loading from './Loading'

function SelectLanguage ({ selectedLanguage, onSelect }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

  return (
    <ul className='languages'>
      {languages.map(lang => (
        <li
          style={lang === selectedLanguage ? { color: '#d0021b' } : null}
          onClick={() => onSelect(lang)}
          key={lang}>
            {lang}
        </li>
      ))}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

function RepoGrid ({ repos }) {
  return (
    <ul className='popular-list'>
      {repos.map(({ name, owner, html_url, stargazers_count }, index) => (
        <li className='popular-item'
          key={name}>
            <div className='popular-rank'>
              #{index + 1}
            </div>
            <ul className='space-list-items'>
              <li>
                <img className='avatar'
                  src={owner.avatar_url}
                  alt={`Avatar for ${owner.login}`} />
              </li>
              <li>
                <a href={html_url}>
                  {name}
                </a>
              </li>
              <li>@{owner.login}</li>
              <li>{stargazers_count} stars</li>
            </ul>
        </li>
      ))}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

class Popular extends Component {
  state = {
    selectedLanguage: 'All',
    repos: null,
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }

  updateLanguage = lang => {
    this.setState({
      selectedLanguage: lang,
      repos: null
    })

    api.fetchPopularRepos(lang)
      .then(repos => this.setState({ repos }))
  }

  render() {
    const { selectedLanguage, repos } = this.state

    return (
      <div>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage} />
        {!repos
          ? <Loading />
          : <RepoGrid
              repos={repos} />}
      </div>
    )
  }
}

export default Popular
