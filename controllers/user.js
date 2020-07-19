const db = require("../models");

const show = (req, res) => {
  if (req.session.currentUser) {
    db.User.findById(req.session.currentUser.id, (err, foundUser) => {
      if (err)
        return res.json({
          message: err,
        });

      res.status(200).json({
        user: foundUser,
      });
    });
  } else {
    return res.json({
      message: "Please create an account to view profile",
    });
  }
};

const destroy = (req, res) => {
  if (req.session.currentUser) {
    db.User.findByIdAndDelete(
      req.session.currentUser.id,
      (err, deletedUser) => {
        if (err) console.log("Error in user.destroy: ", err);
        if (!deletedUser)
          return res.json({
            message: "No user found",
          });

        res.status(200).json({
          message: "Thank you hope you join again!",
        });
      }
    );
  }
};

const update = (req, res) => {
  if (req.session.currentUser) {
    const options = { new: true };
    db.User.findByIdAndUpdate(
      req.session.currentUser.id,
      req.body,
      options,
      (err, updatedUser) => {
        if (err) console.log("Error in user.update:", err);
        if (!updatedUser)
          return res.json({
            message: "Sorry no user with that ID found.",
          });

        res.status(200).json({ user: updatedUser });
      }
    );
  }
};

module.exports = {
  show,
  update,
  destroy,
};
