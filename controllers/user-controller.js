const User = require("../models/user-model");

// GET /signup
exports.getSignup = (req, res, next) => {
  try {
    res.render("signup", {
      pageTitle: "Signup",
      pageClass: "signup-page",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

// POST /signup
exports.postSignup = async (req, res, next) => {
  const { firstName, lastName, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.render("signup", {
      pageTitle: "Signup",
      pageClass: "signup-page",
      error: "Passwords do not match",
      entries: req.body,
    });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("signup", {
        pageTitle: "Signup",
        pageClass: "signup-page",
        error: "Email already in use",
        entries: req.body,
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      roles: ["user"],
    });

    await newUser.save();

    req.session.user = newUser;
    req.session.isAuthenticated = true;

    req.session.save((err) => {
      if (err) {
        console.error(err);
        return next(err); 
      }

      req.flash("success", `Welcome, ${newUser.firstName}!`);
      res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    res.render("signup", {
      pageTitle: "Signup",
      pageClass: "signup-page",
      error:
        err.name === "ValidationError"
          ? Object.values(err.errors)[0].message
          : "Something went wrong",
      entries: req.body,
    });
  }
};


// GET /login
exports.getLogin = (req, res, next) => {
  try {
    res.render("login", {
      pageTitle: "Login",
      pageClass: "login-page",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

// POST /login
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        pageTitle: "Login",
        pageClass: "login-page",
        error: "Invalid credentials",
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.render("login", {
        pageTitle: "Login",
        pageClass: "login-page",
        error: "Invalid credentials",
      });
    }

    req.session.user = user;
    req.session.isAuthenticated = true;

    req.session.save((err) => {
      if (err) {
        console.error(err);
        return next(err); 
      }

      req.flash("success", `Welcome back, ${user.firstName}!`);
      res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    res.render("login", {
      pageTitle: "Login",
      pageClass: "login-page",
      error: "Something went wrong, please try again.",
    });

  }
};

// POST /logout
exports.postLogout = (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      res.redirect("/auth/login");
    });
  } catch (err) {
    next(err);
  }
};
