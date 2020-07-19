function addUserCookie(req, res, next) {
  if (req.session.currentUser) res.locals.loggedIn = true;
  console.log("User authenticated");
  next();
}

module.exports = addUserCookie;
