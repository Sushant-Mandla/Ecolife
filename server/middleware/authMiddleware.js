module.exports = (req, res, next) => {
  const user = req.headers["x-user-id"];
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  req.userId = user;
  next();
};