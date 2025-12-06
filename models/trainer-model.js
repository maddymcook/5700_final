const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [1, "Name must be between 1 and 50 characters"],
    maxlength: [50, "Name must be between 1 and 50 characters"]
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

  expertise: {
    type: String,
    required: [true, "Expertise is required"]
  },

  bio: {
    type: String,
    required: [true, "Bio is required"]
  },

  slug: {
    type: String,
    unique: true
  }
});

trainerSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().trim().replace(/\s+/g, "-");
  }
  next();
});

module.exports = mongoose.model("Trainer", trainerSchema);
