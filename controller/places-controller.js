const fs = require("fs");

const { validationResult } = require("express-validator");

const getLocation = require("../utils/getLocation");
const mongoose = require("mongoose");

const Httperror = require("../helper/Httperror");
const Place = require("../models/places-model");
const User = require("../models/users-model");

const getUser = async (req, res, next) => {
  let places;
  try {
    places = await User.findById(req.params.uid).populate("places");
    if (!places || places.places.length === 0) {
      return next(new Httperror("Not found the places", 404));
    }
  } catch (error) {
    return next(new Httperror("Something went wrong try again later", 500));
  }
  res.status(200).json({
    places: places.places.map((place) => place.toObject({ getters: true })),
  });
};

const getPlaces = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.pid);
    if (!place) {
      return next(new Httperror("Not found the places", 404));
    }
    res.status(200).send({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(new Httperror("Something went wrong try again later", 500));
  }
};

const newPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new Httperror("Input is not valid", 422));
  }
  const { title, description, address, creator, image } = req.body;
  let place;
  try {
    const location = await getLocation(address);
    place = new Place({
      title,
      description,
      address,
      image: req.file.path,
      location,
      creator,
    });
  } catch (error) {
    return next(new Httperror("Invalid location", 422));
  }
  let user;
  try {
    user = await User.findById(creator);
    if (!user) {
      return next(new Httperror("User not found", 404));
    }
  } catch (error) {
    return next(new Httperror("Something went wrong, Try again later", 500));
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.save({ session: sess });
    user.places.push(place);
    await user.save({ session: sess });
    await sess.commitTransaction();

    res.status(201).json(place);
  } catch (error) {
    return next(new Httperror("User is not created try again later", 500));
  }
};

const updatePlaceById = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new Httperror("Invalid inputs", 422));
  }
  try {
    const updatedPlace = await Place.findById(req.params.pid);
    updatedPlace.title = req.body.title;
    updatedPlace.description = req.body.description;
    if (!updatedPlace) {
      return next(new Httperror("Place not found try again", 404));
    }
    if (req.userData.userId !== updatedPlace.creator.toString()) {
      return next(new Httperror("You are not allowed!", 401));
    }
    updatedPlace.save().then((response) => {
      res.status(201).json({ place: updatedPlace.toObject({ getters: true }) });
    });
  } catch (error) {
    return next(new Httperror("Ops something went wrong try again later", 500));
  }
};

const deletePlace = async (req, res, next) => {
  let place;
  try {
    place = await Place.findById(req.params.pid).populate("creator");
    if (!place) {
      return next(new Httperror("Place not found", 404));
    }
    if (req.userData.userId !== place.creator.id.toString()) {
      return next(new Httperror("You are not Allowed", 401));
    }
    const imagePath = place.image;

    const index = place.creator.places.findIndex((key) => key === place._id);
    place.creator.places.splice(index, 1);
    await place.creator.save();
    place.remove().then((response) => {
      fs.unlink(imagePath, (err) => {
        console.log(err);
      });
      res.status(200).json(response);
    });
  } catch (error) {
    return next(new Httperror("Something went wrong try again later", 500));
  }
};

module.exports = {
  getPlaces,
  getUser,
  newPlace,
  updatePlaceById,
  deletePlace,
};
