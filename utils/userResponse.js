const _ = require("lodash");

module.exports = (user) => _.pick(user, ["username", "_id", "savedGroups"]);
