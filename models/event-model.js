const mongoose = require("mongoose");
const slugify = require("slugify");

const eventSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [1, "Title must be between 1 and 50 characters"],
    maxlength: [50, "Title must be between 1 and 50 characters"]
  },

  summary: {
    type: String,
    required: [true, "Summary is required"],
    minlength: [1, "Summary must be between 1 and 350 characters"],
    maxlength: [350, "Summary must be between 1 and 350 characters"]
  },

  image: {
    type: String,
    required: [true, "Image is required"],
    validate: {
      validator: function (value) {
        return /\.(jpg|jpeg|png)$/i.test(value);
      },
      message: "Image must be a .jpg, .jpeg, or .png file"
    }
  },

  date: {
    type: Date,
    required: [true, "Date is required"]
  },

  slug: {
    type: String,
    unique: true
  }
});

eventSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, trim: true });
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
