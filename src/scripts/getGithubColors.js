const axios = require('axios');

// const saveFile = require('./saveFile');

module.exports = async function getGithubColors() {
  try {
    const url =
      'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json';
    const response = await axios.get(url);
    const data = response.data;

    // saveFile('./build/GithubColors.json', JSON.stringify(data, null, 2));

    return data;
  } catch (err) {
    console.log('' + err);
    return {};
  }
};
