module.exports = function (repos) {
  let html = '';

  html += `<table>
\t<thead>
\t\t<tr>
\t\t\t<td>#</td>
\t\t\t<td>Repository</td>
\t\t\t<td>Updated</td>
\t\t\t<td>Login</td>
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
\t\t</tr>
`;
  });

  html += `\t</tbody>
</table>
`;

  return html;
};
