const Course = require("../models/course-model");
const User = require("../models/user-model");
const Trainer = require("../models/trainer-model");

// GET courses
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("trainer");

    const user = req.user || null;
    let userCourseIds = [];

    if (user && user.courses) {
      userCourseIds = user.courses.map((c) => c.toString());
    }

    const coursesWithFlags = courses.map((course) => {
      const isFull = course.registrants.length >= course.capacity;
      const isRegistered = userCourseIds.includes(course._id.toString());
      return { ...course.toObject(), isFull, isRegistered };
    });

    res.render("courses", {
      pageTitle: "Courses",
      pageClass: "courses-page",
      courses: coursesWithFlags,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// GET courses slug 
exports.getCourseDetails = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const course = await Course.findOne({ slug }).populate("trainer");

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Course Not Found",
        pageClass: "error-page",
      });
    }

    const user = req.user || null;
    let userIsRegistered = false;

    if (user) {
      userIsRegistered = course.registrants.some(
        (r) => r.toString() === user._id.toString()
      );
    }

    const availableSeats = course.capacity - course.registrants.length;
    const isFull = availableSeats <= 0;

    res.render("course-details", {
      pageTitle: "Course Details",
      pageClass: "course-details-page",
      course,
      availableSeats,
      userIsRegistered,
      isFull,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


exports.getTopCoursesByLikes = async (limit) => {
  try {
    const courses = await Course.find()
      .sort({ likes: -1 })
      .limit(limit)
      .populate("trainer");
    return courses;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// GET /courses/register
exports.getRegisterForm = async (req, res, next) => {
  try {
    const courses = await Course.find({}).sort({ title: 1 });

    res.render("registration", {
      pageTitle: "Register for a Course",
      pageClass: "registration-page",
      user: req.user,
      courses,
      selectedCourseId: req.query.courseId || null,
      error: null,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// POST /courses/register
exports.postRegister = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.body.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Course Not Found",
        pageClass: "error-page",
      });
    }

    if (course.registrants.length >= course.capacity) {
      return res.status(400).render("404", {
        pageTitle: "Course Full",
        pageClass: "error-page",
      });
    }

    const user = await User.findById(userId);

    if (!course.registrants.some((r) => r.toString() === userId.toString())) {
      course.registrants.push(userId);
      await course.save();
    }

    if (!user.courses.some((c) => c.toString() === courseId.toString())) {
      user.courses.push(courseId);
      await user.save();
    }

    res.render("registration-success", {
      pageTitle: "Registration Successful",
      pageClass: "registration-success-page",
      user,
      course,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// POST /courses/unregister
exports.postUnregister = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.body.courseId;

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
        pageClass: "error-page",
      });
    }

    course.registrants = course.registrants.filter(
      (r) => r.toString() !== userId.toString()
    );
    await course.save();

    user.courses = user.courses.filter(
      (c) => c.toString() !== courseId.toString()
    );
    await user.save();

    res.redirect(`/courses/${course.slug}`);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// GET /courses/admin/create
exports.getCreateCourseForm = async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ name: 1 });

    res.render("create-course", {
      pageTitle: "Create Course",
      pageClass: "create-course-page",
      trainers,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// POST /courses/admin/create
exports.postCreateCourse = async (req, res, next) => {
  try {
    const {
      title,
      summary,
      description,
      price,
      capacity,
      trainer,
      schedule,
    } = req.body;

    const imageFileName = req.file ? req.file.filename : null;

    const course = new Course({
      title,
      summary,
      description,
      price: Number(price),
      capacity: Number(capacity),
      trainer,
      schedule,
      image: imageFileName || "default-course.jpg",
    });

    await course.save();

    res.redirect("/courses");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// GET /courses/:slug/edit
exports.getEditCourseForm = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).populate("trainer");

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Course Not Found",
        pageClass: "error-page",
      });
    }

    const trainers = await Trainer.find().sort({ name: 1 });

    res.render("edit-course", {
      pageTitle: "Edit Course",
      pageClass: "edit-course-page",
      course,
      trainers,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// POST /courses/:slug/edit
exports.postEditCourse = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const {
      title,
      summary,
      description,
      price,
      capacity,
      trainer,
      schedule,
    } = req.body;

    const course = await Course.findOne({ slug });
    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Course Not Found",
        pageClass: "error-page",
      });
    }

    course.title = title;
    course.summary = summary;
    course.description = description;
    course.price = Number(price);
    course.capacity = Number(capacity);
    course.trainer = trainer;
    course.schedule = schedule;

    if (req.file) {
      course.image = req.file.filename;
    }

    await course.save();

    res.redirect(`/courses/${course.slug}`);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// POST /courses/:slug/delete
exports.postDeleteCourse = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug });
    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "Course Not Found",
        pageClass: "error-page",
      });
    }

    await User.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );

    await Course.deleteOne({ _id: course._id });

    res.redirect("/courses");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// GET /courses/my
exports.getMyCourses = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect("/auth/login");
    }

    const user = await User.findById(req.user._id).populate("courses");

    if (!user) {
      return res.redirect("/auth/login");
    }

    const myCourses = (user.courses || []).map((course) => {
      const registrantCount = course.registrants ? course.registrants.length : 0;
      const availableSeats = course.capacity - registrantCount;
      const isFull = availableSeats <= 0;

      return {
        ...course.toObject(),
        availableSeats,
        isFull,
      };
    });

    res.render("my-courses", {
      pageTitle: "My Courses",
      pageClass: "my-courses-page",
      user,
      courses: myCourses,
    });
  } catch (err) {
    console.error(err);
    next(err); 
  }
};

