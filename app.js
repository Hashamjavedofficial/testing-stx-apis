const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const placesRoute = require("./routes/places-routes");
const userRoute = require("./routes/users-routes");

const { errorHandlerMiddleware } = require("./middlewares/error-handler");
const Httperror = require("./helper/Httperror");

const app = express();

const port = process.env.PORT || 6000

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoute);
app.use("/api/users", userRoute);

app.use((req, res, next) => {
  next(new Httperror("Page not found", 404));
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log("server running on port ",port );
});
