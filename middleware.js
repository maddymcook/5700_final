const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "log");
const logFile = path.join(logDirectory, "logRequests.txt");
const logStream = fs.createWriteStream(logFile, { flags: "a" });
const requestLogger = morgan("dev", { stream: logStream });

function ensureAuthenticated(req, res, next) {
  if (req.user) return next();

  const redirectTo = encodeURIComponent(req.originalUrl || "/");
  return res.redirect(`/auth/login?next=${redirectTo}`);
}

function ensureAdmin(req, res, next) {
  if (req.user && req.user.roles && req.user.roles.includes("admin")) {
    return next();
  }
  const redirectTo = encodeURIComponent(req.originalUrl || "/");
  return res.redirect(`/auth/login?next=${redirectTo}`);
}

module.exports = {
  requestLogger,
  ensureAuthenticated,
  ensureAdmin,
};
