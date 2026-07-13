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

    let targetFolder = "science_hub/general";
    const currentRoute = req.baseUrl + req.path;

    if (currentRoute.includes("/users") || currentRoute.includes("/profile")) {
      targetFolder = "science_hub/avatars";
    } else if (
      currentRoute.includes("/blogs") ||
      currentRoute.includes("/posts")
    ) {
      targetFolder = "science_hub/blog_images";
    } else if (
      currentRoute.includes("/programs") ||
      currentRoute.includes("/applications")
    ) {
      targetFolder = isImage
        ? "science_hub/program_attachments/images"
        : "science_hub/program_attachments/docs";
    } else if (currentRoute.includes("/organizations")) {
      targetFolder = "science_hub/organization_logos";
    }

    return {
      folder: targetFolder,
      resource_type: isImage ? "image" : "auto",
      public_id: `${Date.now()}-${cleanFileName}`,
      format: isImage ? undefined : file.originalname.split(".").pop(),
    };
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: (file) => {
      return file.mimetype.startsWith("image/")
        ? 5 * 1024 * 1024
        : 25 * 1024 * 1024;
    },
  },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isAllowedDoc = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(file.mimetype);

    if (isImage || isAllowedDoc) {
      cb(null, true);
    } else {
      const error = new Error(
        "Непідтримуваний формат файлу! Дозволено зображення та PDF/Word документи.",
      );
      error.statusCode = 400;
      cb(error, false);
    }
  },
});

module.exports = upload;
