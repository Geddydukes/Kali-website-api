const mongoose = require("mongoose");

const PhotoSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  cloudinaryPublicId: {
    type: String,
  },
  location: {
    type: String,
  },
  date: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;
