const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");
const File = require("../models/File");
const auth = require("../middleware/authMiddleware");

// @route   POST api/folders
// @desc    Create a new folder
router.post("/", auth, async (req, res) => {
  try {
    const { name, parentId } = req.body;

    const newFolder = new Folder({
      name,
      userId: req.user.id, // Comes from middleware
      parentId: parentId || null, // If no parentId, it's a Root folder
    });

    const folder = await newFolder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   GET api/folders/:parentId
// @desc    Get all folders inside a specific parent folder
router.get("/:parentId", auth, async (req, res) => {
  try {
    const parentId =
      req.params.parentId === "root" ? null : req.params.parentId;

    // Find folders that belong to this user AND have this parentId
    const folders = await Folder.find({
      userId: req.user.id,
      parentId: parentId,
    });

    res.json(folders);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   GET api/folders/size/:folderId
// @desc    Calculate total size of a folder including all nested files and sub-folders
router.get("/size/:folderId", auth, async (req, res) => {
  try {
    // Recursive function to traverse through nested folders
    const calculateSize = async (folderId) => {
      let total = 0;

      // 1. Sum size of all files directly inside the current folder
      const files = await File.find({ folderId });
      total += files.reduce((acc, file) => acc + file.size, 0);

      // 2. Find all sub-folders inside the current folder
      const subFolders = await Folder.find({ parentId: folderId });

      // 3. Recursively add sizes of each sub-folder
      for (let sub of subFolders) {
        total += await calculateSize(sub._id);
      }

      return total;
    };

    const totalSize = await calculateSize(req.params.folderId);
    res.json({
      folderId: req.params.folderId,
      totalSizeInBytes: totalSize,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
