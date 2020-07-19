const db = require("../models");
const bcrypt = require("bcrypt");

const register = (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).json({
      status: 400,
      message: "Please fill all fields to proceed",
    });
  }
  db.User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err)
      return res.status(500).json({
        status: 500,
        message: "Something went wrong. Please try again.",
      });

    if (foundUser)
      return res.status(400).json({
        status: 400,
        message: "A user with that email address already exists!",
      });

    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err)
          return res.status(500).json({
            status: 500,
            message: "Something went wrong. Please try again.",
          });
        const newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
        };
        db.User.create(newUser, (err, savedUser) => {
          if (err) return res.status(500).json({ status: 500, message: err });
          return res.status(200).json({
            status: 200,
            message: `${savedUser.firstName} has been registered! Thanks for joining the family!`,
          });
        });
      });
    });
  });
};

const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ status: 400, message: "Please enter your email and password" });
  }
  db.User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err)
      return res.status(500).json({
        status: 500,
        message: "Something went wrong. Please try again.",
      });

    if (!foundUser)
      return res.status(400).json({
        status: 400,
        message: "No user with that email address exists!",
      });
    bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
      if (err)
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again",
        });
      if (isMatch) {
        req.session.currentUser = { id: foundUser._id };
        return res.status(400).json({
          status: 400,
          message: "Happy Browsing!",
          user: foundUser._id,
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: "Email or Password is incorrect",
        });
      }
    });
  });
};

const verify = (req, res) => {
  if (!req.session.currentUser)
    return res.status(401).json({
      message: "Unauthorized!",
    });
  res.status(200).json({
    message: `Current user verified with ID ${req.session.currentUser.id} `,
  });
};

const logout = (req, res) => {
  if (!req.session.currentUser)
    return res.status(401).json({
      message: "No User to Log out!",
    });
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({
        message: "Internal Server issue. Please try again",
      });
    res.status(200).json({
      message: "Log out successful, hope to see you again soon!",
    });
  });
};

module.exports = {
  register,
  login,
  verify,
  logout,
};
