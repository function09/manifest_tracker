import mongoose from "mongoose";

const { Schema } = mongoose;

const manifestSchema = new Schema({
  sendingWarehouse: { type: String, required: true },
  documentNumber: { type: String, required: true },
  materialDocNumber: { type: String },
  departureDate: { type: String, required: true },
  arrivalDate: { type: String, required: true },
  items: { type: Array, required: true },
  UUID: { type: String, required: true },
});

manifestSchema.virtual("id").get(function () {
  return `/${this.UUID}`;
});

const Manifest = mongoose.model("manifest", manifestSchema);

export default Manifest;
