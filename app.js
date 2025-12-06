// Import libraries
const errorController = require('./controllers/error-controller');
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const apiRoutes = require('./routes/api-routes');

const { requestLogger } = require("./middleware");

// Import Routes
const homeRoutes = require("./routes/home-routes");
const trainerRoutes = require("./routes/trainer-routes");
const eventRoutes = require("./routes/event-routes");
const courseRoutes = require("./routes/course-routes");
const contactRoutes = require("./routes/contact-routes");
const userRoutes = require("./routes/user-routes");

// Database connection string
const MONGODB_URI = process.env.MONGODB_URI;

// Initialize the express app
const app = express();

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

// Layout settings
app.use(expressLayouts);
app.set("layout", "layout");

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/api', apiRoutes);

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-fallback-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// Attach user to request
app.use((req, res, next) => {
  req.user = req.session.user || null;
  next();
});

// Global template variables
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  res.locals.user = req.session.user || {};
  res.locals.isAdmin = req.session.user?.roles?.includes("admin");

  res.locals.flashMessages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };

  res.locals.pageTitle = res.locals.pageTitle || "";
  res.locals.pageClass = res.locals.pageClass || "";

  next();
});

// ROUTES
app.use("/trainers", trainerRoutes);
app.use("/events", eventRoutes);
app.use("/courses", courseRoutes);
app.use("/contacts", contactRoutes);
app.use("/auth", userRoutes);
app.use("/", homeRoutes);

// ERROR HANDLERS (must be last)
app.use(errorController.get404);
app.use(errorController.get500);

// DB + start server
const PORT = process.env.PORT || 3000;

mongo
