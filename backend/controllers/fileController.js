const multer = require("multer");
const multerS3 = require("multer-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = require("../config/s3");
const File = require("../models/File");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const savedFile = await File.create({
      originalName: req.file.originalname,
      fileName,
      fileUrl,
      size: req.file.size,
    });

    res.status(200).json({
      message: "File uploaded successfully",
      file: savedFile,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });

    res.status(200).json(files);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch files",
    });
  }
};

module.exports = {
  upload,
  uploadFile,
  getFiles,
};