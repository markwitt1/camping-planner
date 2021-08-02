const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const userResponse = require("../utils/userResponse");
const router = express.Router();

router.get("/me", ensureAuthenticated, (req, res) =>
  res.send(userResponse(req.user))
);

module.exports = router;
