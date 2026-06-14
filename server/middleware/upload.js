const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Ініціалізація Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const isImage = file.mimetype.startsWith("image/");
    const cleanFileName = file.originalname
      .split(".")[0]
      .replace(/[^a-zA-Z0-9]/g, "_");

    return {
      folder: isImage ? "science_hub/covers" : "science_hub/articles",
      resource_type: "auto",
      public_id: `${Date.now()}-${cleanFileName}`,
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;
