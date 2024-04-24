import "dotenv/config";

const authenticateUser = (req, res, next) => {
  console.log(req.session);
  console.log(req.id);
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(403).json({ message: "No authorization" });
  }
};

export default authenticateUser;
