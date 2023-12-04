const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);

const mongoURI =
  "mongodb+srv://abenettaleb:Ping18991231@track-db.ot3rzf1.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI);

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo", err);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
