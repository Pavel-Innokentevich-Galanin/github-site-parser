const axios = require('axios');
const jssoup = require('jssoup').default;

module.exports = async function getRepositoryInfo(login, repo) {
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
            url: `https://github.com${e?.nextSibling?.nextElement?.attrs?.href}`,
          };
          break;
        case 'Stars':
          stars = Number(
            e?.nextSibling?.text?.trim()?.replace('\n', '')?.split(' ')[0]
          );
          break;
        case 'Watchers':
          watchers = Number(
            e?.nextSibling?.text?.trim()?.replace('\n', '')?.split(' ')[0]
          );
          break;
        case 'Forks':
          forks = Number(
            e?.nextSibling?.text?.trim()?.replace('\n', '')?.split(' ')[0]
          );
          break;
      }
    });

    const result = {
      description,
      license,
      stars,
      watchers,
      forks,
      topics,
    };

    return result;
  } catch (error) {
    console.log('' + error);
    return {};
  }
};
