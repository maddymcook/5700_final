const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [50, "Name must be between 1 and 50 characters"]
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Email must be a valid email address"
    }
  },

  subject: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  postDate: {
    type: Date,
    required: true
  },

  response: {
    type: String,
    default: null
  },

  responseDate: {
    type: Date,
    default: null
  }
});

// Export as Mongoose model
module.exports = mongoose.model("Contact", contactSchema);
