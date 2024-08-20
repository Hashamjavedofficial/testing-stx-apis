const multer = require("multer");

const MIME_TYPES = {
  "image/png": ".png",
  "image/jpeg": ".jpeg",
  "image/jpg": ".jpg",
};

const fileUpload = multer({
  limits: 5000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPES[file.mimetype];
      cb(null, file.fieldname + "-" + Date.now() + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPES[file.mimetype];
    let error = isValid ? null : new Error("Invalid file type");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
