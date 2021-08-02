const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
