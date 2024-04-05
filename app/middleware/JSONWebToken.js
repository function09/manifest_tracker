import jwt from "jsonwebtoken";
import "dotenv/config";

const authenticateToken = (req, res, next) => {
  const { TOKEN_SECRET } = process.env;

  const { JWT } = req.cookies;

  if (!JWT) {
    return res.status(403).json({ message: "No authorization token found" });
  }
  try {
    jwt.verify(JWT, TOKEN_SECRET);
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Token verification failed:", error });
  }
};

export default authenticateToken;
