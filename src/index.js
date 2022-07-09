const getReposUser = require('./scripts/getReposUser');
const getReposOrg = require('./scripts/getReposOrg');
const getGithubColors = require('./scripts/getGithubColors');

async function main() {
  const ColorsObject = await getGithubColors();

  const users = ['Pavel-Innokentevich-Galanin'];
  const orgs = ['ooodepa', 'ToDoCalendar', 'BrSTU-PO4-Pavel-Galanin'];

  for (let i = 0; i < users.length; ++i) {
    await getReposUser(users[i], ColorsObject);
  }

  for (let i = 0; i < orgs.length; ++i) {
    await getReposOrg(orgs[i], ColorsObject);
  }
}

main();
