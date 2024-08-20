const fs = require("fs");
const errorHandlerMiddleware = (error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknow error occured" });
};

module.exports = {
  errorHandlerMiddleware,
};
