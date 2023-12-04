const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer asdfasdfasdf'

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in." });
    }

    const { userId } = payload;
    console.log(
      "👉🏼 ~ file: requireAuth.js:20 ~ jwt.verify ~ payload:",
      payload
    );

    const user = await User.findById(userId);
    console.log("👉🏼 ~ file: requireAuth.js:26 ~ jwt.verify ~ user:", user);
    req.user = user;
    next();
  });
};
