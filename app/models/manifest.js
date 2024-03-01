import mongoose from "mongoose";

const { Schema } = mongoose;

// Entries are not required as if they're blank, they display as an empty string
const manifestSchema = new Schema({
  sendingWarehouse: { type: String },
  documentNumber: { type: String },
  materialDocNumber: { type: String },
  departureDate: { type: String },
  arrivalDate: { type: String },
  items: { type: Array },
  UUID: { type: String },
});

const Manifest = mongoose.model("manifest", manifestSchema);

export default Manifest;
