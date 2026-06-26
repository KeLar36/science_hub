const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");

    const cleanFileName = file.originalname
      .split(".")[0]
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    return {
      folder: isImage ? "science_hub/covers" : "science_hub/articles",
      resource_type: isImage ? "image" : "raw",

      public_id: `${Date.now()}-${cleanFileName}`,

      format: isImage ? undefined : file.originalname.split(".").pop(),
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

module.exports = upload;
