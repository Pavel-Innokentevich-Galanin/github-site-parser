const axios = require('axios');
const jssoup = require('jssoup').default;

module.exports = async function (org) {
  try {
    let array_repos = [];
    let url = `https://github.com/orgs/${org}/repositories?page=1&type=all`;

    let response = await axios.get(url);
    const html = response.data;

    const soup = new jssoup(html);

    const div_org_repos = soup.find('div', {
      id: 'org-repositories',
    });

    //   const ul = soup.find('ul');
    const li_array = div_org_repos.findAll('li', { class: 'Box-row' });
    li_array.forEach((element) => {
      const repo_title__h3 = element.find('h3');
      const repo_title__a = repo_title__h3.find('a');
      const repo_title__text = repo_title__a.text.trim();
      const repo_title__url = repo_title__a.attrs.href;
      const date__tag = element.find('relative-time');
      const date__str = date__tag.attrs.datetime;
      const days_ago = Math.round(
        (Date.now() - Date.parse(date__str)) / 86400000
      );
      array_repos.push({
        name: repo_title__text,
        url: repo_title__url,
        updated: {
          datetime: date__str,
          days_ago: days_ago,
        },
        author: {
          login: org,
        },
      });

      // console.log(`${repo_title__text} - https://github.com${repo_title__url}`);
    });

    array_repos.sort(function compare(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    return array_repos;
  } catch (err) {
    console.log('' + err);
    return [];
  }
};
