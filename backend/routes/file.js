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

// @route   GET api/files/:folderId
// @desc    Get files inside a specific folder (or root)
// backend/routes/file.js

router.get("/:folderId", auth, async (req, res) => {
  try {
    // Logic: Agar frontend se 'root' aaya, toh folderId null hai (Home)
    // Warna jo ID aayi hai wahi folderId hai
    const folderId =
      req.params.folderId === "root" ? null : req.params.folderId;

    const files = await File.find({
      userId: req.user.id,
      folderId: folderId, // Looks for files where folderId is null or specific ID
    });

    res.json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
