// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// HEROKU DEPLOYMENT
const path = require('path');
const { assert } = require("console");
app.use(express.static(path.join(__dirname, 'build')));

// ---------------------------------------------------
//         START OF EXPRESS-SESSION CONFIG
// ---------------------------------------------------

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET, //DON'T FORGET TO ADD THIS IN YOUR .'.env' File
  resave: false,
  saveUninitialized: false, 
  cookie: {
    maxAge: 1000 * 24* 60 * 60 // your cookie will be cleared after these seconds
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/clique",
    // Time to Live for sessions in DB. After that time it will delete it!
    ttl: 24* 60 * 60 // your session will be cleared after these seconds
  })
}));

// ---------------------------------------------------
//          END OF EXPRESS-SESSION CONFIG
// ---------------------------------------------------

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const eventRoutes = require("./routes/event.routes");
app.use("/api", eventRoutes);

const groupRoutes = require("./routes/group.routes");
app.use("/api", groupRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

// HEROKU DEPLOYMENT
app.use((req, res, next) => {
	// If no routes match, send them the React HTML.
	res.sendFile(__dirname + "/build/index.html");
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
