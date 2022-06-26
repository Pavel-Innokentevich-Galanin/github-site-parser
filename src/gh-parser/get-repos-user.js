const axios = require('axios');
const jssoup = require('jssoup').default;

module.exports = async function (user) {
  try {
    let array_repos = [];
    let url = `https://github.com/${user}?page=1&tab=repositories`;
    while (1) {
      // console.log(url);
      let response = await axios.get(url);
      const html = response.data;

      const soup = new jssoup(html);

      // Получаем div в котором есть список ul c репозиториями
      const div__user_repositories_list = soup.find('div', {
        id: 'user-repositories-list',
      });

      // Получаем ul список
      const ul = div__user_repositories_list.find('ul', {
        'data-filterable-for': 'your-repos-filter',
      });

      const li_array = ul.findAll('li');
      li_array.forEach((element) => {
        const repo_title__h3 = element.find('h3', {
          class: 'wb-break-all',
        });
        const repo_title__a = repo_title__h3.find('a');
        const repo_title__text = repo_title__a.text.trim();
        const repo_title__url = repo_title__a.attrs.href;

        const date__tag = element.find('relative-time');
        const date__str = date__tag?.attrs?.datetime;
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
            login: user,
          },
        });

        // console.log(
        // `${repo_title__text} - https://github.com${repo_title__url}`
        // );
      });

      //Получаем блок с кнопками вперёд и назад
      const navigation__div = div__user_repositories_list.find('div', {
        role: 'navigation',
        'aria-label': 'Pagination',
      });

      //Получаем ссылку вперёд
      const navigation_a_next = navigation__div?.find('a', {
        class: 'next_page',
      });
      url = navigation_a_next?.attrs?.href;

      if (url === undefined) {
        break;
      } else {
        url = `https://github.com${url}`;
        // console.log(' ');
        // console.log(url);
      }
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

    return array_repos;
  } catch (err) {
    console.log(err);
    return [];
  }
};
