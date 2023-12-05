const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

userSchema.pre("save", function (next) {
  // this = user
  const user = this;
  if (!this.isModified("password")) {
    return next();
  }

  // generate a salt and use it to hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

// compare the password in the database with the one the user enters
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;

  // bcrypt.compare returns a promise
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      // if there was an error, reject the promise
      if (err) {
        return reject(err);
      }

      // if the passwords do not match, reject the promise
      if (!isMatch) {
        return reject(false);
      }

      // if everything went ok, resolve the promise
      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);
