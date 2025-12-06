const express = require("express");
const router = express.Router();
const axios = require("axios");
const homeController = require("../controllers/home-controller");

router.get("/", homeController.getHome);

router.get("/about", homeController.getAbout);

router.get("/externalapi", async (req, res, next) => {
  try {
    const apiResponse = await axios.get("https://dog.ceo/api/breeds/image/random");
    const dogImageUrl = apiResponse.data.message;

    res.render("external-api", {
      pageTitle: "External API Demo",
      pageClass: "external-api-page",
      dogImageUrl,
      errorMessage: null,
    });
  } catch (error) {
    console.error("Error calling Dog CEO API:", error);
    res.status(500).render("external-api", {
      pageTitle: "External API Demo",
      pageClass: "external-api-page",
      dogImageUrl: null,
      errorMessage: "Sorry, could not load data from the external API.",
    });
  }
});

module.exports = router;
