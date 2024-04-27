import "dotenv/config";

const authenticateUser = (req, res, next) => {
  console.log("\n require auth");

  if (!req.isAuthenticated()) {
    return res.status(403).json({ messaged: "Unauthorized" });
  }

  next();
};

export default authenticateUser;
