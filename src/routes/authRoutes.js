const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
      },
      "MY_SECRET_KEY"
    );
    res.send(token);
  } catch (err) {
    return res.status(422).send(err.message); // 422 = unprocessable entity
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // if the user did not provide an email or password
  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  // find the user by their email
  const user = await User.findOne({ email });
  // if the user does not exist
  if (!user) {
    return res.status(404).send({ error: "Invalid password or email" });
  }

  try {
    // compare the user's password with the one they provided
    await user.comparePassword(password);
    // if the passwords match, generate a token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      "MY_SECRET_KEY"
    );
    // send the token to the user
    res.send(token);
  } catch (err) {
    // if the passwords do not match, return an error
    return res.status(404).send({ error: "Invalid password or email" });
  }
});

module.exports = router;
