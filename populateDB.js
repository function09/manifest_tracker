import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import Manifest from "./app/models/manifests.js";
import Accounts from "./app/models/accounts.js";

// return array of command line arguments,extract last index, the connection string
const userArgs = process.argv.slice(2);
const CONNECTION_STRING = userArgs[0];

const uploadManifest = async (sendingWarehouse, documentNumber, departureDate, arrivalDate, items, UUID) => {
  try {
    const manifest = new Manifest({ sendingWarehouse, documentNumber, departureDate, arrivalDate, items, UUID });
    await manifest.save();
  } catch (err) {
    console.log(err);
  }
};

const createNewUser = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const account = new Accounts({ email, password: hashedPassword });
    await account.save();
  } catch (err) {
    console.log(err);
  }
};

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(CONNECTION_STRING);
  console.log("Debug: Should be connected");
  await createNewUser("testUser", "123abc");
  await uploadManifest("Placeholder", "Placeholder", "Placeholder", "Placeholder", ["Placeholder", "Placeholder"], uuidv4());
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

main().catch((err) => {
  console.log(err);
});
