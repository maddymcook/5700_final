const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [50, "Name must be at most 50 characters"]
  },

  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [100, "Title must be at most 100 characters"]
  },

  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot be more than 5"]
  },

  testimonial: {
    type: String,
    required: [true, "Testimonial text is required"]
  },

  image: {
    type: String,
    validate: {
      validator: function (value) {
        if (!value) return true;
        return /\.(jpg|jpeg|png)$/i.test(value);
      },
      message: "Image must be a .jpg, .jpeg, or .png file"
    }
  }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
