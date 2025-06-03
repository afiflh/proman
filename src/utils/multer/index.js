const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, "../../storage/public/attachments");
    ensureDirectoryExistence(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    let uniqueSuffix = uuid();
    let fileExtension = path.extname(file.originalname);

    let newFileName = `${uniqueSuffix}${fileExtension}`;

    cb(null, newFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname).toLowerCase() === ".exe") {
    cb(new Error("Executable files are not allowed"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { files: 5, fileSize: 5 * 1024 * 1024 },
});

module.exports = { upload, uploadMultiple };
