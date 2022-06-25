const fs = require('fs');
const get_array_all_gh_repos = require('./get_array_all_gh_repos');
const get_array_all_gh_repos_org = require('./get_array_all_gh_repos_org');
const get_repos_html_table = require('./get_repos_html_table');
const save_file = require('./save_file');
const get_array_languages = require('./get_array_languages');

async function main() {
  const repos1 = await get_array_all_gh_repos('Pavel-Innokentevich-Galanin');
  const repos2 = await get_array_all_gh_repos_org('ooodepa');
  const repos3 = await get_array_all_gh_repos_org('todocalendar');
  let repos_array = [...repos1, ...repos2, ...repos3];
  // console.log(repos_array);

  for (let i = 0; i < repos_array.length; ++i) {
    let stat_langs_array = await get_array_languages(
      repos_array[i].login,
      repos_array[i].name
    );
    let langs_str = stat_langs_array.map((e) => e.lang).join(', ');
    // console.log(langs_str);
    repos_array[i].langs_str = langs_str;
  }

  console.log(repos_array);

  let html = get_repos_html_table(repos_array);
  // console.log(html);

  let date = new Date().toJSON();

  html = `# Repositories\n\nThe post was created in \`${date}\`.\n\n${html}`;

  let dir = __dirname + './../build';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  save_file('./build/README.md', html);
}

main();
