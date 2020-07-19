// ==== IMPORTS
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// ==== MODEL
const db = require("../models");

// ==== ROUTES
// Get all photos that user has permission to view,
// including photos shared in birding sessions by other users
// GET '/'
const getAllPhotos = async (req, res) => {
  try {
    // use array of birding session IDs
    const foundPhotos = await db.Photo.find();
    // return found photos as JSON
    res.status(200).json({
      status: 200,
      foundPhotos,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting all photos",
    });
  }
};

const createPhoto = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in",
    });
  }
  try {
    const photoData = {
      ...req.body,
      user: req.session.currentUser,
    };
    const newPhoto = await db.Photo.create(photoData);

    res.status(200).json({
      status: 200,
      message: "Created a photo",
      newPhoto,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong creating a photo",
    });
  }
};

// Get single photo
// GET '/:birdingSessionId/:id'
const getOnePhoto = async (req, res) => {
  try {
    // check that user has permission to access this birding session
    const foundPhoto = await db.Photo.findById(req.params.id);
    res.status(200).json({
      status: 200,
      message: "Got photo",
      foundPhoto,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting a photo",
    });
  }
};

// Update a photo
// PUT '/:birdingSessionId/:id'
const updatePhoto = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in",
    });
  }
  try {
    // get photo by id in db, update
    const updatedPhoto = await db.Photo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // return data as JSON
    res.status(200).json({
      status: 200,
      message: "Updated photo",
      updatedPhoto,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong updating a photo",
    });
  }
};

// Delete a photo
const deletePhoto = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in",
    });
  }
  try {
    // find photo in db by id and delete
    const deletedPhoto = await db.Photo.findByIdAndDelete(req.params.id);

    // delete from cloudinary
    cloudinary.v2.uploader.destroy(
      deletedPhoto.cloudinaryPublicId,
      (err, result) => {
        if (err) {
          console.log("error deleting from cloudinary", err);
        }
      }
    );

    // return data as json
    res.status(200).json({
      status: 200,
      message: "Deleted photo",
      deletedPhoto,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong deleting a photo",
    });
  }
};

// ==== EXPORT
module.exports = {
  getAllPhotos,
  createPhoto,
  getOnePhoto,
  updatePhoto,
  deletePhoto,
};
