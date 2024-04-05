import bcrypt from "bcryptjs";
import { findUser, userExists } from "../services/userDatabaseFunctions.js";
import "dotenv/config";

const loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUser(username);
    const match = await bcrypt.compare(password, user.password);

    if (!(await userExists(username)) || !match) {
      return res.status(422).json({ message: "Username or password is incorrect." });
    }

    req.session.userId = username;

    return res.status(200).json({ message: `User ${username} successfully logged in` });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default loginController;
