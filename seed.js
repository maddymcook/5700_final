// seed.js
// Run with: node seed.js
// WARNING: This will DELETE all Trainers, Courses, Events, and Testimonials
// in your current database and replace them with sample data.

const mongoose = require("mongoose");

// Use the same URI as in app.js (or better: move it to an .env file)
const MONGODB_URI =
  "mongodb+srv://maddymoo322:maddymoo322@cluster0.b2tjwjq.mongodb.net/final-project?retryWrites=true&w=majority";

// Import Mongoose models
const Trainer = require("./models/trainer-model");
const Course = require("./models/course-model");
const Event = require("./models/event-model");
const Testimonial = require("./models/testimonial-model");

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    // 🚨 Clear existing data
    console.log("Clearing existing collections...");
    await Promise.all([
      Trainer.deleteMany({}),
      Course.deleteMany({}),
      Event.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);
    console.log("Collections cleared.");

    // 1️⃣ Insert TRAINERS
    const trainersData = [
      {
        name: "Alice Johnson",
        image: "trainer-1.jpg", // used as assets/img/team/trainer-1.jpg
        expertise: "Full-Stack Web Development",
        bio: "Alice has over 10 years of experience building web applications with JavaScript, Node.js, and modern frontend frameworks.",
        slug: "alice-johnson",
      },
      {
        name: "Brian Lee",
        image: "trainer-2.jpg",
        expertise: "Data Science & Python",
        bio: "Brian specializes in data analysis, machine learning, and Python programming for real-world applications.",
        slug: "brian-lee",
      },
      {
        name: "Carla Rivera",
        image: "trainer-3.jpg",
        expertise: "Cloud & DevOps",
        bio: "Carla helps teams design scalable cloud architectures and CI/CD pipelines using modern DevOps practices.",
        slug: "carla-rivera",
      },
    ];

    console.log("Inserting trainers...");
    const trainers = await Trainer.insertMany(trainersData);
    console.log(`Inserted ${trainers.length} trainers.`);

    const [alice, brian, carla] = trainers;

    // 2️⃣ Insert COURSES (reference trainers via their _id)
    const coursesData = [
      {
        title: "Intro to JavaScript",
        image: "course-1.jpg", // assets/img/course-1.jpg
        summary: "Learn the fundamentals of JavaScript for the web.",
        description:
          "This beginner-friendly course covers variables, functions, DOM manipulation, and events to get you started with interactive web pages.",
        price: 99,
        capacity: 25,
        registrants: [], // array of User ObjectIds (empty for now)
        likes: 10,
        trainer: alice._id,
        schedule: "Mondays & Wednesdays, 5:00 PM - 7:00 PM",
        slug: "intro-to-javascript",
      },
      {
        title: "Python for Data Analysis",
        image: "course-2.jpg",
        summary: "Use Python to clean, analyze, and visualize data.",
        description:
          "Explore NumPy, pandas, and basic visualization to work with real-world datasets and build data analysis workflows.",
        price: 129,
        capacity: 20,
        registrants: [],
        likes: 18,
        trainer: brian._id,
        schedule: "Tuesdays & Thursdays, 6:00 PM - 8:00 PM",
        slug: "python-for-data-analysis",
      },
      {
        title: "Modern Web Development with Node.js",
        image: "course-3.jpg",
        summary: "Build full-stack web apps with Node.js and Express.",
        description:
          "Learn how to build REST APIs, work with databases, and structure a production-ready Node.js application.",
        price: 149,
        capacity: 30,
        registrants: [],
        likes: 25,
        trainer: alice._id,
        schedule: "Saturdays, 10:00 AM - 1:00 PM",
        slug: "modern-web-development-with-nodejs",
      },
      {
        title: "DevOps Fundamentals",
        image: "course-4.jpg",
        summary:
          "Understand the tools and mindset behind modern DevOps workflows.",
        description:
          "This course covers CI/CD, containerization, monitoring, and cloud deployments to help you ship software faster and safer.",
        price: 159,
        capacity: 20,
        registrants: [],
        likes: 14,
        trainer: carla._id,
        schedule: "Fridays, 3:00 PM - 6:00 PM",
        slug: "devops-fundamentals",
      },
    ];

    console.log("Inserting courses...");
    const courses = await Course.insertMany(coursesData);
    console.log(`Inserted ${courses.length} courses.`);

    // 3️⃣ Insert EVENTS
    const eventsData = [
      {
        title: "Spring Coding Bootcamp",
        summary:
          "A full-day workshop focused on building your first full-stack application.",
        image: "event-1.jpg", // assets/img/event-1.jpg
        date: new Date("2025-03-15T14:00:00Z"),
        slug: "spring-coding-bootcamp",
      },
      {
        title: "Data Science Career Panel",
        summary:
          "Hear from industry experts about breaking into data science.",
        image: "event-2.jpg",
        date: new Date("2025-04-10T23:00:00Z"),
        slug: "data-science-career-panel",
      },
      {
        title: "DevOps Live Demo Day",
        summary:
          "Live demos of CI/CD pipelines, monitoring tools, and real-world DevOps workflows.",
        image: "event-3.jpg",
        date: new Date("2025-05-05T18:30:00Z"),
        slug: "devops-live-demo-day",
      },
    ];

    console.log("Inserting events...");
    const events = await Event.insertMany(eventsData);
    console.log(`Inserted ${events.length} events.`);

    // 4️⃣ Insert TESTIMONIALS
    const testimonialsData = [
      {
        name: "Jordan Smith",
        title: "Front-End Developer",
        rating: 5,
        testimonial:
          "The Intro to JavaScript course gave me the confidence to start building real projects. The instructor explained everything so clearly.",
        image: "testimonials-1.jpg", // assets/img/testimonials/testimonials-1.jpg
      },
      {
        name: "Priya Patel",
        title: "Data Analyst",
        rating: 4,
        testimonial:
          "The Python for Data Analysis course helped me level up my work at my job. I use pandas almost every day now.",
        image: "testimonials-2.jpg",
      },
      {
        name: "Luis Martinez",
        title: "DevOps Engineer",
        rating: 5,
        testimonial:
          "The DevOps Fundamentals course connected a lot of dots. I finally understand how CI/CD fits into the bigger picture.",
        image: "testimonials-3.jpg",
      },
    ];

    console.log("Inserting testimonials...");
    const testimonials = await Testimonial.insertMany(testimonialsData);
    console.log(`Inserted ${testimonials.length} testimonials.`);

    console.log("✅ Seeding complete!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

// Only run seed() if this file is executed directly: node seed.js
if (require.main === module) {
  seed();
}
