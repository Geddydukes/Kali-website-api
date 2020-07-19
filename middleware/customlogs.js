function logRequest(req, res, next) {
  console.log(`Request at path ${req.originalUrl} at ${date(datestring)}`);
  next();
}

module.exports = logRequest;
