const get_array_all_gh_repos = require('./get_array_all_gh_repos');
const get_repos_html_table = require('./get_repos_html_table');
const save_file = require('./save_file');

async function main() {
  const repos_array = await get_array_all_gh_repos(
    'Pavel-Innokentevich-Galanin'
  );
  console.log(repos_array);

  let html = get_repos_html_table(repos_array);
  console.log(html);

  let date = new Date().toJSON();

  html = `# Repositories\n\nThe post was created in \`${date}\`.\n\n${html}`;

  save_file('./build/README.md', html);
}

main();
