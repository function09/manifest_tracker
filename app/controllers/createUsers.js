import { createUser, userExists } from "../services/userDatabaseFunctions.js";

const createUserController = async (req, res) => {
  const { userName, password } = req.body;
  const user = await userExists(userName);
  try {
    if (user) {
      return res.status(409).json({ error: "username already exists" });
    }

    await createUser(userName, password);

    return res.status(200).json({ message: "user account created successfully" });
  } catch (error) {
    console.log(error);
  }
};

export default createUserController;
