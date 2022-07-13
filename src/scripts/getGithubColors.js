const axios = require('axios');

module.exports = async function getGithubColors() {
  try {
    const url =
      'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json';
    const response = await axios.get(url);
    const data = response.data;

    return data;
  } catch (error) {
    console.log('' + error);
    return {};
  }
};
