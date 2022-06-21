const fs = require('fs');

module.exports = function (path, text) {
  fs.writeFile(path, text, function (err) {
    if (err) {
      console.log(err);
    }
  });
};
