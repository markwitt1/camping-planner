const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { ensureAuthenticated } = require("../config/auth");

const Group = require("../models/Group");
const ThingToBring = require("../models/ThingToBring");
const User = require("../models/User");

// Welcome Page
router.get("/", ensureAuthenticated, async (req, res) => {
  const allGroups = await Group.find({});
  res.send(allGroups);
});

router.post("/", ensureAuthenticated, (req, res) => {
  const newGroup = new Group(req.body);

  newGroup
    .save()
    .then((group) => {
      User.findOne({ _id: req.user._id }).then((user) => {
        user.savedGroups.push(group._id);
        user.save().then(() => res.send(group));
      });
    })
    .catch((err) => res.statusCode(500).send(err));
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    Group.findOne({ _id: req.params.id }, (err, group) => {
      if (err) return res.status(404).send(err);
      res.send(group);
    });
  } catch (e) {
    res.send(e);
  }
});

router.put("/:id", ensureAuthenticated, async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id });
  if (group) {
    const newGroup = _.merge(group, req.body);
    newGroup
      .save()
      .then()
      .then((group) => {
        res.send(group);
      })
      .catch((err) => res.statusCode(500).send(err));
  } else {
    res.status(404);
  }
});

router.post("/:id/addThingToBring", ensureAuthenticated, async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id });

  const newThing = new ThingToBring(
    _.merge(req.body, { creatorId: req.user._id, groupId: group._id })
  );
  newThing
    .save()
    .then((thingToBring) => {
      if (!!group && !!thingToBring) {
        res.json(thingToBring);
      } else {
        res.status(404);
      }
    })
    .catch((err) => res.status(500).send(err));
});

router.get("/:id/getThingsToBring", ensureAuthenticated, async (req, res) => {
  Group.exists({ _id: req.params.id }, async (err, exists) => {
    if (err || !exists) return res.status(404).send(err);
    else {
      const thingsToBring = await ThingToBring.find({
        groupId: req.params.id,
      });

      res.send(thingsToBring);
    }
  });
});

router.delete("/:id", ensureAuthenticated, (req, res) => {
  Group.deleteOne({ _id: req.params.id }).then(() => {
    res.sendStatus(200);
  });
});

module.exports = router;
