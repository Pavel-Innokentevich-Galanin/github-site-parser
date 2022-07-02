const getReposUser = require('./scripts/getReposUser');
const getReposOrg = require('./scripts/getReposOrg');

async function main() {
  const users = ['Pavel-Innokentevich-Galanin'];
  const orgs = ['ooodepa', 'ToDoCalendar', 'BrSTU-PO4-Pavel-Galanin'];

  for (let i = 0; i < users.length; ++i) {
    await getReposUser(users[i]);
  }

  for (let i = 0; i < orgs.length; ++i) {
    await getReposOrg(orgs[i]);
  }
}

main();
