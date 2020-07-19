// ==== IMPORTS
const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");

// ==== ROUTES
// path = /api/v1/photo
router.get("/", photoController.getAllPhotos);
router.post("/create/photo", photoController.createPhoto);
router.get("/:id", photoController.getOnePhoto);
router.put("/:id", photoController.updatePhoto);
router.delete("/:id", photoController.deletePhoto);

// ==== EXPORT
module.exports = router;
