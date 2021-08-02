const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const _ = require("lodash");
const ThingToBring = require("../models/ThingToBring");

// Welcome Page
router.get("/", ensureAuthenticated, async (req, res) => {
  const allThingsToBring = await ThingToBring.find({});
  res.send(allThingsToBring);
});

router.post("/", ensureAuthenticated, (req, res) => {
  const newThing = new ThingToBring(req.body);
  newThing
    .save()
    .then()
    .then((thingToBring) => {
      res.send(thingToBring);
    })
    .catch((err) => res.statusCode(500).send(err));
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const thingToBring = await ThingToBring.findOne({ _id: req.params.id });
    res.send(thingToBring);
  } catch (e) {
    res.send(e);
  }
});

router.put("/:id", ensureAuthenticated, async (req, res) => {
  const thingToBring = await ThingToBring.findOne({ _id: req.params.id });
  if (thingToBring) {
    const newThing = _.merge(thingToBring, req.body);
    newThing
      .save()
      .then((thing) => {
        res.send(thing);
      })
      .catch((err) => res.statusCode(500).send(err));
  } else {
    res.status(404);
  }
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    await ThingToBring.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
