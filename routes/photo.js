// ==== IMPORTS
const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");

// ==== ROUTES
// path = /api/v1/photo
// index route - get all photos by user (or get all photos from all sessions, including photos from other users?)
router.get("/", photoController.getAllPhotos);

// create photo associated with a specific bird
router.post("/create/photo", photoController.createPhoto);

// get single photo
router.get("/:id", photoController.getOnePhoto);

// update photo
router.put("/:id", photoController.updatePhoto);

// delete photo
router.delete("/:id", photoController.deletePhoto);

// ==== EXPORT
module.exports = router;
