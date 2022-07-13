const fs = require('fs');

module.exports = function saveFile(path, text) {
  fs.writeFile(path, text, function (error) {
    if (error) {
      console.log('' + error);
    }
  });
};
