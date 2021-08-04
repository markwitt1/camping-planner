const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/User");
const { ensureAuthenticated } = require("../config/auth");
const Group = require("../models/Group");
const userResponse = require("../utils/userResponse");

// Register
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).json({ err: "Please enter all fields" });
  }

  if (password.length < 8) {
    res.status(401).json({ err: "Password must be at least 8 characters" });
  } else {
    User.findOne({ username: username }).then((user) => {
      if (user) {
        res.status(401).json({ err: "User already exists" });
      } else {
        const newUser = new User({
          username,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                res.send({
                  success: "You are now registered and can log in",
                });
              })
              .catch((err) => console.error(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", passport.authenticate("local"), (req, res) => {
  const user = userResponse(req.user);
  res.json(user);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.send({ message: "successfully logged out" });
});

router.get("/savedGroups", ensureAuthenticated, async (req, res) => {
  if (req.user.savedGroups.length === 0) {
    return res.json([]);
  }
  const savedGroups = await Group.find({
    _id: { $in: req.user.savedGroups },
  });

  res.json(savedGroups);
});

router.get("/saveGroup/:groupId", ensureAuthenticated, async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  if (user) {
    user.savedGroups.push(req.params.groupId);
    user
      .save()
      .then((u) => {
        res.send(userResponse(u));
      })
      .catch((err) => res.statusCode(500).send(err));
  } else {
    res.sendStatus(401);
  }
});

router.get("/:username", ensureAuthenticated, async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  res.json(user);
});

module.exports = router;
