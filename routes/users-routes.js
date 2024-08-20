const express = require("express");
const { check } = require("express-validator");

const fileUpload = require("../middlewares/file-upload");
const { getUsers, signIn, signUp } = require("../controller/user-controller");
const router = express.Router();

const signUpValidators = [
  check("name").notEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),
];

router.get("/", getUsers);

router.post("/signup", fileUpload.single("image"), signUpValidators, signUp);

router.post("/login", signIn);

module.exports = router;
