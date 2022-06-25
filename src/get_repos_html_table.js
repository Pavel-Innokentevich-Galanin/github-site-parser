module.exports = function (repos) {
  let html = '';

  html += `<table>
\t<thead>
\t\t<tr>
\t\t\t<td>#</td>
\t\t\t<td>Repository</td>
\t\t\t<td>Updated</td>
\t\t\t<td>Login</td>
\t\t\t<td>Stars</td>
\t\t\t<td>Watchers</td>
\t\t\t<td>Forks</td>
\t\t\t<td>Description</td>
\t\t\t<td>License</td>
\t\t\t<td>Languages</td>
\t\t</tr>
\t</thead>
\t<tbody>
`;

  repos.forEach((repo, index) => {
    html += `\t\t<tr>
\t\t\t<td>${index + 1}</td>
\t\t\t<td><a href="${repo.url}">${repo.name}</a></td>
\t\t\t<td>${repo.updated_day_ago} days ago</td>
\t\t\t<td><a href="https://github.com/${repo.login}">${repo.login}</a></td>
\t\t\t<td>${repo.stars != 0 ? `:star: ${repo.stars}` : ''}</td>
\t\t\t<td>${repo.watchers != 0 ? `:eyes: ${repo.watchers}` : ''}</td>
\t\t\t<td>${repo.forks != 0 ? `:electric_plug: ${repo.forks}` : ''}</td>
\t\t\t<td>${repo.description}</td>
\t\t\t<td>${
      repo.license.name
        ? `:page_facing_up: <a href="https://github.com${repo.license.url}">${repo.license.name}</a>`
        : '-'
    }</td>
\t\t\t<td>${repo.langs.map((e) => e.lang).join(', ')}</td>
\t\t</tr>
`;
  });

  html += `\t</tbody>
</table>
`;

  return html;
};
