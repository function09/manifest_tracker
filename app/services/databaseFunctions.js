import { v4 as uuidv4 } from "uuid";
import Manifest from "../models/manifest.js";
import createManifestObject from "./pdfParse.js";

// database queries and such go here see if you can organize this better

const checkIfDocumentExists = async (req) => {
  let exists;
  const { buffer } = req.file;

  try {
    const document = await createManifestObject(buffer);
    const findDocument = await Manifest.findOne({ documentNumber: document.documentNumber }, "-_id -__v");

    if (!findDocument) {
      exists = false;
    } else {
      exists = true;
    }
  } catch (error) {
    console.log(error);
  }
  return exists;
};

const getDocument = async (req) => {
  const { buffer } = req.file;

  try {
    const document = await createManifestObject(buffer);
    return await Manifest.findOne({ document: document.documentNumber }, "-_id -__v").exec();
  } catch (error) {
    console.log(error);
  }
};

const saveManifest = async (req) => {
  const { buffer } = req.file;

  try {
    return await new Manifest({ ...(await createManifestObject(buffer)), UUID: uuidv4() }).save();
  } catch (error) {
    console.log(error);
  }
};

export { checkIfDocumentExists, getDocument, createManifestObject, saveManifest };
