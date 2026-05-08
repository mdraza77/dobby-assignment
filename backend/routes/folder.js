const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");
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

module.exports = router;
