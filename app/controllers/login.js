import bcrypt from "bcryptjs";
import { findUser } from "../services/userDatabaseFunctions.js";
import "dotenv/config";
import passport from "passport";

const loginController = async (req, res, next) => {
  console.log(`1: Login handler ${JSON.stringify(req.body)}`);
  passport.authenticate("local", (err, user) => {
    console.log("3: Passport authenticate cb");

    if (err) {
      return res.status(401).json({ message: "Username or password is incorrect" });
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    req.logIn(user, (error) => {
      if (error) {
        return next(err);
      }
      return res.status(200).json({ message: "User successfully logged in!", user: user.id });
    });
  })(req, res, next);
  //   let { username, password } = req.body;
  //   const authHeader = req.headers.authorization;
  //   if ((!username || !password) && !authHeader) {
  //     return res.status(401).json({ message: "Username, password or authorization header are required. " });
  //   }
  //   if (authHeader) {
  //     const credentials = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
  //     [username, password] = credentials;
  //   }
  //   try {
  //     const user = await findUser(username);
  //     if (!user || !(await bcrypt.compare(password, user.password))) {
  //       return res.status(401).json({ message: "Username or password is incorrect." });
  //     }
  //     req.session.userId = user.UUID;
  //     return res.status(200).json({ message: "Successfully logged in", username });
  //   } catch (error) {
  //     return res.status(500).json({ error });
  //   }
};

export default loginController;
