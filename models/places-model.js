const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placesSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, require: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

const Place = mongoose.model("Place", placesSchema);

module.exports = Place;
