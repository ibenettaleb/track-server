const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, // no two users can have the same email
    required: true, // email is required
  },
  password: {
    type: String,
    required: true,
  },
});

mongoose.model("User", userSchema);
