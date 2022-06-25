const axios = require('axios');
const jssoup = require('jssoup').default;

async function get_repo_info(login, repo) {
  try {
    const url = `https://github.com/${login}/${repo}`;
    const response = await axios.get(url);
    const html = response.data;
    const soup = new jssoup(html);

    const d = soup?.find('div', { class: 'Layout-sidebar' });

    let description = d?.find('p')?.text?.trim();
    description = description ? description : '';

    let topics = [];
    let license = {
      name: '',
      url: '',
    };
    let stars = '';
    let watchers = '';
    let forks = '';

    d.findAll('h3').forEach((e, i) => {
      switch (e?.text) {
        case 'Topics':
          topics = e?.nextSibling?.text
            ?.trim()
            ?.replace(/\s/g, ', ')
            ?.split(', ')
            ?.filter((e) => {
              if (e != '') return e;
            });
          break;
        case 'License':
          license = {
            name: e?.nextSibling?.text?.trim(),
            url: e?.nextSibling?.nextElement?.attrs?.href,
          };
          break;
        case 'Stars':
          stars = e?.nextSibling?.text
            ?.trim()
            ?.replace('\n', '')
            ?.split(' ')[0];
          break;
        case 'Watchers':
          watchers = e?.nextSibling?.text
            ?.trim()
            ?.replace('\n', '')
            ?.split(' ')[0];
          break;
        case 'Forks':
          forks = e?.nextSibling?.text
            ?.trim()
            ?.replace('\n', '')
            ?.split(' ')[0];
          break;
      }
    });

    const result = {
      description,
      license,
      stars,
      watchers,
      forks,
    };
    // console.log(result);

    return result;
  } catch (err) {
    console.log('' + err);
    return {};
  }
}

// get_repo_info('Pavel-Innokentevich-Galanin', 'BrSTU-tex-for-coursework');

module.exports = get_repo_info;
