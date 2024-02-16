import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUser, userExists } from "../services/userDatabaseFunctions.js";
import "dotenv/config";

const loginController = async (req, res) => {
  const user = await findUser(req.body.username);
  const { TOKEN_SECRET } = process.env;

  if (!(await userExists(req.body.username))) {
    return res.status(422).json({ error: "Username does not exist." });
  }

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) {
    return res.status(401).json({ error: "Incorrect credentials." });
  }

  // Can still use key after relogging - curious about this
  const token = jwt.sign({ user: req.body.username }, TOKEN_SECRET, { expiresIn: "1h" });

  return res.status(200).json({ result: `User, ${user.username}, signed on successfully.`, token });
};

export default loginController;
