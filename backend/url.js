// API / GET
exports.GET = (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  console.log(`full URL = ${fullUrl}`);
  console.log(`Database URL ID = ${req.originalUrl}`);
  res.send(fullUrl);
};
