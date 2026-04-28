const multer = require("multer");

const imageOnly = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Chỉ được tải lên file ảnh"));
    return;
  }

  cb(null, true);
};

const uploadProductImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageOnly,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadProductImage;
