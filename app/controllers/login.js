import bcrypt from "bcryptjs";
import { findUser } from "../services/userDatabaseFunctions.js";
import "dotenv/config";

const loginController = async (req, res) => {
  let { username, password } = req.body;
  const authHeader = req.headers.authorization;

  if ((!username || !password) && !authHeader) {
    return res.status(401).json({ message: "Username, password or authorization header are required. " });
  }

  if (authHeader) {
    const credentials = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
    [username, password] = credentials;
  }

  try {
    const user = await findUser(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Username or password is incorrect." });
    }

    req.session.userId = user.UUID;
    return res.status(200).json({ message: "Successfully logged in", username });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default loginController;
