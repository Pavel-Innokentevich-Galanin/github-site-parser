const axios = require('axios');
const jssoup = require('jssoup').default;

module.exports = async function getRepositoryLanguages(
  login,
  repo,
  ColorsObject = {}
) {
  try {
    let array = [];
    let url = `https://github.com/${login}/${repo}/search?l=d`;
    const response = await axios.get(url);
    const html = response.data;

    const soup = new jssoup(html);

    const d = soup?.find('div', { id: 'repo-content-pjax-container' });
    const d2 = d?.find('div', {
      class: ['border', 'rounded-2', 'p-3', 'mb-3', 'd-none', 'd-md-block'],
    });
    const ul = d2?.find('ul', { class: ['filter-list', 'small'] });
    const ul_li_array = ul?.findAll('li');
    ul_li_array?.forEach((element) => {
      const a = element?.find('a');
      const a__text = a?.getText('@@@').split('@@@');
      const counter = Number(a__text[0]);
      const language = a__text[1]?.replace('\n', '')?.trim();
      array?.push({
        counter,
        language,
      });
    });

    let sum_counter = 0;
    array.forEach((obj) => (sum_counter += obj.counter));

    array.forEach((obj) => {
      obj.sum = sum_counter;
    });

    array.forEach((obj) => {
      if (ColorsObject.hasOwnProperty(obj.language)) {
        obj.color = ColorsObject[`${obj.language}`].color;
        obj.url = ColorsObject[`${obj.language}`].url;
      }
    });

    array?.sort(function compare(a, b) {
      if (a.counter > b.counter) {
        return -1;
      }
      if (a.counter < b.counter) {
        return 1;
      }
      return 0;
    });

    return array;
  } catch (error) {
    console.log('' + error);
    return [];
  }
};
