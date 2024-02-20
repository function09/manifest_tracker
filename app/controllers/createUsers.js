import { createUser, userExists } from "../services/userDatabaseFunctions.js";

const createUserController = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await userExists(userName);

    if (user) {
      return res.status(409).json({ message: "username already exists" });
    }

    await createUser(userName, password);

    return res.status(200).json({ message: "user account created successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default createUserController;
