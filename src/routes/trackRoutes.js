const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Track = mongoose.model("Track");

const router = express.Router();
router.use(requireAuth);

router.get("/tracks", async (req, res) => {
  // get all tracks for the current user
  const tracks = await Track.find({ userId: req.user._id });
  res.send(tracks);
});

router.post("/tracks", async (req, res) => {
  // create a new track for the current user
  const { name, locations } = req.body;
  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "You must provide a name and locations" });
  }
  try {
    const track = new Track({ name, locations, userId: req.user._id });
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.delete("/tracks/:id", async (req, res) => {
  // delete a track for the current user
  const { id } = req.params;
  try {
    await Track.findByIdAndDelete(id);
    res.send({ message: "Track deleted" });
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.put("/tracks/:id", async (req, res) => {
  // update a track for the current user
  const { id } = req.params;
  const { name, locations } = req.body;
  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "You must provide a name and locations" });
  }
  try {
    const track = await Track.findByIdAndUpdate(id, { name, locations });
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
