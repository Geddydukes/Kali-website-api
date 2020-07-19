function errorPage(err, req, res, next) {
  console.log(err);
  res.status(500).json({ status: 500, message: "Error handler err" });
}

module.exports = errorPage;
