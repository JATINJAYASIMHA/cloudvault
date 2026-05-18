const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  originalName: String,
  fileName: String,
  fileUrl: String,
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);