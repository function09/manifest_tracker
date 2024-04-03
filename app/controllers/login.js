import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUser, userExists } from "../services/userDatabaseFunctions.js";
import "dotenv/config";

const loginController = async (req, res) => {
  const { TOKEN_SECRET } = process.env;
  try {
    const user = await findUser(req.body.username);

    if (!(await userExists(req.body.username))) {
      return res.status(422).json({ message: "Username or password is incorrect." });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Incorrect credentials." });
    }

    const token = jwt.sign({ user: req.body.username }, TOKEN_SECRET, { expiresIn: "8h" });

    res
      .cookie("JWT", token, {
        httpOnly: true,
        secure: false,
      })
      .status(200)
      .json({ message: "Logged in successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default loginController;
