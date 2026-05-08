const express = require("express");
const router = express.Router();
const File = require("../models/File");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// POST: api/files/upload
router.post("/upload", [auth, upload.single("image")], async (req, res) => {
  try {
    const { name, folderId } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const newFile = new File({
      name: name || req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      folderId: folderId || null,
      userId: req.user.id,
    });

    await newFile.save();
    res.json(newFile);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
