import "dotenv/config";

const authenticateUser = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(403).json({ message: "No authorization" });
  }
};

export default authenticateUser;
