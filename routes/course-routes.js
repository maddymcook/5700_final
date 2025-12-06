const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course-controller");
const { ensureAuthenticated, ensureAdmin } = require("../middleware");
const upload = require("../util/upload");

router.get("/", courseController.getCourses);

router.get("/my", ensureAuthenticated, courseController.getMyCourses);

router.get("/register", ensureAuthenticated, courseController.getRegisterForm);
router.post("/register", ensureAuthenticated, courseController.postRegister);
router.post("/unregister", ensureAuthenticated, courseController.postUnregister);

router.get("/:slug", courseController.getCourseDetails);

router.get(
  "/admin/create",
  ensureAdmin,
  courseController.getCreateCourseForm
);

router.post(
  "/admin/create",
  ensureAdmin,
  upload.single("image"),
  courseController.postCreateCourse
);

router.get(
  "/:slug/edit",
  ensureAdmin,
  courseController.getEditCourseForm
);

router.post(
  "/:slug/edit",
  ensureAdmin,
  upload.single("image"),
  courseController.postEditCourse
);

router.post(
  "/:slug/delete",
  ensureAdmin,
  courseController.postDeleteCourse
);

module.exports = router;
