const getReposUser = require('./scripts/getReposUser');
const getReposOrg = require('./scripts/getReposOrg');
const getGithubColors = require('./scripts/getGithubColors');

async function main() {
  const start_time = new Date();

  const ColorsObject = await getGithubColors();

  const users = ['Pavel-Innokentevich-Galanin'];
  const orgs = ['ooodepa', 'ToDoCalendar', 'BrSTU-PO4-Pavel-Galanin'];

  for (let i = 0; i < users.length; ++i) {
    await getReposUser(users[i], ColorsObject);
  }

  for (let i = 0; i < orgs.length; ++i) {
    await getReposOrg(orgs[i], ColorsObject);
  }

  const end_time = new Date();
  const different_time = end_time.getTime() - start_time.getTime();

  const minutes = Math.round(different_time / 1000 / 60);
  console.log(`App work ${minutes} minutes`);

  const seconds = Math.round(different_time / 1000);
  console.log(`App work ${seconds} seconds`);

  const min = Math.round(different_time / 1000 / 60);
  const sec = (different_time - min * 1000 * 60) / 1000;
  console.log(`\nApp work ${min} minutes ${sec} seconds\n`);

  console.log(start_time.toJSON());
  console.log(end_time.toJSON());
}

main();
