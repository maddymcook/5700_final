// routes/user-routes.js
const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);

router.get("/signup", userController.getSignup);
router.post("/signup", userController.postSignup);

router.post("/logout", userController.postLogout);

module.exports = router;
