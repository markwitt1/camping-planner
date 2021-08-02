const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const path = require("path");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

require("./config/passport")(passport);

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(
  require("cors")({
    credentials: true,
    origin: true,
  })
);

// Express body parser
app.use(express.json({ extended: true }));

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "client/build")));
// Routes
app.use("/api/", require("./routes/index.js"));
app.use("/api/users", require("./routes/users.js"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/thingsToBring", require("./routes/thingsToBring"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));
