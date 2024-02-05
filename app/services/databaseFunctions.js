import { v4 as uuidv4 } from "uuid";
import Manifest from "../models/manifest.js";
import createManifestObject from "./pdfParse.js";

// Clean all of this up

const checkIfDocumentExists = async (file) => {
  const document = await createManifestObject(file);
  const entry = await Manifest.findOne({ documentNumber: document.documentNumber }).exec();
  let check = false;

  if (entry) {
    check = true;
  }
  console.log(check);
  return check;
};

const uploadToDB = async (file) => {
  await new Manifest({ ...(await createManifestObject(file)), UUID: uuidv4() }).save();
};

export { checkIfDocumentExists, uploadToDB };
