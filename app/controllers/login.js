import bcrypt from "bcryptjs";
import { findUser, userExists } from "../services/userDatabaseFunctions.js";
import "dotenv/config";

const loginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: "Username and password are required. " });
  }

  try {
    const user = await findUser(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(422).json({ message: "Username or password is incorrect." });
    }

    req.session.userId = username;

    return res.status(200).json({ message: `User ${username} successfully logged in` });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default loginController;
