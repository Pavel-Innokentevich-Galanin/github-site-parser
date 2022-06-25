const fs = require('fs');
const get_array_all_gh_repos = require('./get_array_all_gh_repos');
const get_array_all_gh_repos_org = require('./get_array_all_gh_repos_org');
const get_repos_html_table = require('./get_repos_html_table');
const save_file = require('./save_file');
const get_array_languages = require('./get_array_languages');
const get_repo_info = require('./get_repo_info');

async function main() {
  const repos1 = await get_array_all_gh_repos('Pavel-Innokentevich-Galanin');
  const repos2 = await get_array_all_gh_repos_org('ooodepa');
  const repos3 = await get_array_all_gh_repos_org('todocalendar');
  let repos_array = [...repos1, ...repos2, ...repos3];
  // console.log(repos_array);

  for (let i = 0; i < repos_array.length; ++i) {
    const procent = (
      Math.round((((i + 1) * 100) / repos_array.length) * 100) / 100
    ).toFixed(2);
    console.log(`${procent} % : ${i + 1} / ${repos_array.length}`);

    let langs_array = await get_array_languages(
      repos_array[i].login,
      repos_array[i].name
    );

    let repo_info = await get_repo_info(
      repos_array[i].login,
      repos_array[i].name
    );

    repos_array[i] = {
      ...repos_array[i],
      ...repo_info,
      langs: langs_array,
    };
    // console.log(repos_array[i]);
  }

  // console.log(repos_array);

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
