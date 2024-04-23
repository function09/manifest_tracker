const verifySession = (req, res) => {
  if (req.session && req.session.userId) {
    return res.status(200).json({ message: "Session valid", userId: req.session.userId });
  }
  return res.status(403).json({ message: "Session invalid" });
};

export default verifySession;
