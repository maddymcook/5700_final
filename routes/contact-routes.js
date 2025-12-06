const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact-controller");
const { ensureAdmin } = require("../middleware");

router.get("/new", contactController.getContact);
router.post("/create", contactController.postContact);
router.get("/thanks", contactController.getThanks);

router.get(
    "/admin/respond",
    ensureAdmin,
    contactController.getUnansweredContacts
  );
  
  router.get(
    "/admin/respond/:id",
    ensureAdmin,
    contactController.getContactResponseForm
  );
  
  router.post(
    "/admin/respond/:id",
    ensureAdmin,
    contactController.postContactResponse
  );
  
  module.exports = router;
  
