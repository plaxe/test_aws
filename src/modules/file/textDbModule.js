const fs   = require("fs");
const path = require("path");

module.exports.getItems = function () {
  return (
    JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../db.json"))) || []
  );
};

module.exports.saveItems = function (data) {
  fs.writeFileSync(path.resolve(__dirname, "../../db.json"), JSON.stringify(data));
};
