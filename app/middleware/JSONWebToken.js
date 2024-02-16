import jwt from "jsonwebtoken";
import "dotenv/config";

const authenticateToken = (req, res, next) => {
  const { TOKEN_SECRET } = process.env;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: "Authorization failed. No authorization header." });
  }

  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer") {
    return res.status(401).json({ error: "Authorization failed. No access token." });
  }

  const token = tokenParts[1];

  jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error });
    }
    req.user = decoded.user;
    next();
  });
};

export default authenticateToken;
