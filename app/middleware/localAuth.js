import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";
import { findUser } from "../services/userDatabaseFunctions.js";

const LocalStrategy = new Strategy({ passReqToCallback: true }, async (req, username, password, done) => {
  console.log(`2: Local strategy verify cb: ${JSON.stringify({ username })}`);

  // This is where we call the db to verify user
  const user = await findUser(username);

  if (!user) {
    return done(null, false);
  }

  const passwordCheck = await new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });

  if (!passwordCheck) {
    return done("Username or password are incorrect.", null);
  }

  return done(null, user);
});

export default LocalStrategy;
