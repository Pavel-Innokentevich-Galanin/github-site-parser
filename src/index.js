const fs = require('fs');
const ghParser = require('./gh-parser/index');

async function main() {
  const repos1 = await ghParser.getReposUser('Pavel-Innokentevich-Galanin');
  const repos2 = await ghParser.getReposOrg('ooodepa');
  const repos3 = await ghParser.getReposOrg('todocalendar');

  const json = {
    'Pavel-Innokentevich-Galanin': repos1,
    ooodepa: repos2,
    todocalendar: repos3,
  };

  for (let i = 0; i < Object.keys(json).length; ++i) {
    const login = Object.keys(json)[i];
    console.log(
      `\`--- [${i + 1}/${Object.keys(json).length}] (${procent(
        i,
        Object.keys(json).length
      )} %) ${login}`
    );

    for (let j = 0; j < json[login].length; ++j) {
      const repo_name = json[login][j].name;
      console.log(
        `\t\`--- [${j + 1}/${json[login].length}] (${procent(
          j,
          json[login].length
        )} %) ${repo_name}`
      );

      let languages = await ghParser.getRepoLangs(login, repo_name);
      json[login][j].languages = languages;

      let about = await ghParser.getRepo(login, repo_name);
      json[login][j].about = about;
    }
  }

  let dir = __dirname + './../build';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  // Сохраняем JSON
  save_file('./build/data.json', JSON.stringify(json, null, 2));

  let markdown = `# Repositories\n\nThe post was created in \`${new Date().toJSON()}\`.\n\n${generateTable(
    json
  )}`;

  // Сохраняем Markdown
  save_file('./build/README.md', markdown);
}

function generateTable(json) {
  let html = '';

  html += `<table>
  <thead>
    <tr>
      <td>#</td>
      <td>Repository</td>
      <td>Updated</td>
      <td>Stars</td>
      <td>Watchers</td>
      <td>Forks</td>
      <td>Description</td>
      <td>License</td>
      <td>Languages</td>
    </tr>
  </thead>
  <tbody>
`;
  const site = 'https://github.com';
  Object.keys(json).forEach((login) => {
    html += `\
    <tr>
      <td colspan="9"><a href="${site}/${login}">${login}</a></td>
    </tr>
`;
    json[login].forEach((repo, i) => {
      const index = i + 1;
      const repo_url = `${site}${repo.url}`;
      const repo_name = repo.name;
      const days_ago = `${repo.updated.days_ago} days ago`;
      const stars = repo.about.stars != 0 ? `:star: ${repo.about.stars}` : '';
      const watchers =
        repo.about.watchers != 0 ? `:eyes: ${repo.about.watchers}` : '';
      const forks =
        repo.about.forks != 0 ? `:electric_plug: ${repo.about.forks}` : '';
      const description = repo.about.description;
      const license = repo.about.license.name;
      const license_url = `${site}${repo.about.license.url}`;
      const languages = repo.languages.map((e) => e.language).join(', ');
      html += `\
    <tr>
      <td>${index}</td>
      <td><a href="${repo_url}">${repo_name}</a></td>
      <td>${days_ago}</td>
      <td>${stars}</td>
      <td>${watchers}</td>
      <td>${forks}</td>
      <td>${description}</td>
      <td>${
        license
          ? `:page_facing_up: <a href="${license_url}">${license}</a>`
          : '-'
      }</td>
      <td>${languages}</td>
    </tr>
`;
    });
  });

  html += `\
  </tbody>
</table>
`;

  return html;
}

function procent(iteration, length) {
  return (Math.round((((iteration + 1) * 100) / length) * 100) / 100).toFixed(
    2
  );
}

function save_file(path, text) {
  fs.writeFile(path, text, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

main();
