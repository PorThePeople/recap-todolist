const notFound = (req, res, next) => {
  res
    .status(404)
    .json({ message: `Request URL: ${req.method} ${req.url} not found` });
};
module.exports = notFound;
