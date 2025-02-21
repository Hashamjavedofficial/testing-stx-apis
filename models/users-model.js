const mongoose = require("mongoose");
// const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
