const mongoose = require("mongoose");
const slugify = require("slugify");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [1, "Title must be between 1 and 50 characters"],
    maxlength: [50, "Title must be between 1 and 50 characters"],
    set: function (value) {
      if (value) {
        this.slug = slugify(value, { lower: true, trim: true });
      }
      return value;
    },
  },

  image: {
    type: String,
    required: [true, "Image is required"],
    validate: {
      validator: function (value) {
        return /\.(jpg|jpeg|png)$/i.test(value);
      },
      message: "Image must be a .jpg, .jpeg, or .png file",
    },
  },

  summary: {
    type: String,
    required: [true, "Summary is required"],
  },

  description: {
    type: String,
    required: [true, "Description is required"],
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
  },

  capacity: {
    type: Number,
    required: [true, "Capacity is required"],
  },

  registrants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  likes: {
    type: Number,
    default: 0,
  },

  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
    required: [true, "Trainer is required"],
  },

  schedule: {
    type: String,
    required: [true, "Schedule is required"],
  },

  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

courseSchema.pre("save", function () {
  if ((!this.slug || this.slug.trim() === "") && this.title) {
    this.slug = slugify(this.title, { lower: true, trim: true });
  }
});

module.exports = mongoose.model("Course", courseSchema);
