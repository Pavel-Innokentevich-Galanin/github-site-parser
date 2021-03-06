const axios = require('axios');
const jssoup = require('jssoup').default;

const getRepositoryLanguages = require('./getRepositoryLanguages');
const getRepositoryInfo = require('./getRepositoryInfo');
const saveFile = require('./saveFile');

module.exports = async function getReposOrg(org, ColorsObject = {}) {
  try {
    let array_repos = [];
    let url = `https://github.com/orgs/${org}/repositories?page=1&type=all`;

    let response = await axios.get(url);
    const html = response.data;

    const soup = new jssoup(html);

    const div_org_repos = soup.find('div', {
      id: 'org-repositories',
    });

    const li_array = div_org_repos.findAll('li', { class: 'Box-row' });
    li_array.forEach((element) => {
      const repo_title__h3 = element.find('h3');
      const repo_title__a = repo_title__h3.find('a');
      const repo_title__text = repo_title__a.text.trim();
      const repo_title__url = `https://github.com${repo_title__a.attrs.href}`;
      const date__tag = element.find('relative-time');
      const date__str = date__tag.attrs.datetime;
      array_repos.push({
        name: repo_title__text,
        html_url: repo_title__url,
        updated_at: date__str,
        owner: {
          login: org,
        },
      });
    });

    console.log(`${org} langs`);
    for (let i = 0; i < array_repos.length; ++i) {
      console.log(`${i + 1}/${array_repos.length}`);
      const login = array_repos[i].owner.login;
      const repo = array_repos[i].name;
      const languages = await getRepositoryLanguages(login, repo, ColorsObject);
      array_repos[i].languages = languages;
    }

    console.log(`${org} more`);
    for (let i = 0; i < array_repos.length; ++i) {
      console.log(`${i + 1}/${array_repos.length}`);
      const login = array_repos[i].owner.login;
      const repo = array_repos[i].name;
      const languages = await getRepositoryInfo(login, repo);
      array_repos[i].more = languages;
    }

    array_repos.sort(function compare(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    saveFile(`./build/${org}.json`, JSON.stringify(array_repos, null, 2));

    return array_repos;
  } catch (error) {
    console.log('' + error);
    return [];
  }
};
