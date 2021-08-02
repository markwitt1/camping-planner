const mongoose = require("mongoose");

const ThingToBringSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    creatorId: {
      type: String,
      required: true,
    },
    minimumAmount: {
      type: Number,
      required: true,
    },
    usersBringing: {
      type: [String],
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
  },
  { collection: "thingsToBring" }
);

const ThingToBring = mongoose.model("ThingToBring", ThingToBringSchema);

module.exports = ThingToBring;
