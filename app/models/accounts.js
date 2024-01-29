import mongoose from "mongoose";

const { Schema } = mongoose;

const accountsSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Accounts = mongoose.model("accounts", accountsSchema);

export default Accounts;
