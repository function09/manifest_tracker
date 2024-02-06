import { v4 as uuidv4 } from "uuid";
import Manifest from "../models/manifest.js";
import createManifestObject from "./pdfParse.js";

<<<<<<< HEAD
// database queries and such go here see if you can organize this better

const checkIfDocumentExists = async (req) => {
  let exists;
  const { buffer } = req.file;
  const document = await createManifestObject(buffer);

  try {
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
  const document = await createManifestObject(buffer);
  const findDocument = await Manifest.findOne({ document: document.documentNumber }, "-_id -__v").exec();
  return findDocument;
};

const saveManifest = async (req) => {
  const { buffer } = req.file;
  await new Manifest({ ...(await createManifestObject(buffer)), UUID: uuidv4() }).save();
};

export { checkIfDocumentExists, getDocument, createManifestObject, saveManifest };
=======
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

const getDocument = async (file) => {
  const document = await createManifestObject(file);
  const findDocument = await Manifest.find({ document: document.documentNumber }).exec();
  return findDocument;
};

const uploadToDB = async (file) => {
  await new Manifest({ ...(await createManifestObject(file)), UUID: uuidv4() }).save();
};

export { checkIfDocumentExists, getDocument, uploadToDB };
>>>>>>> 99ac936a0e99740bdc951fe95240b68ee8d2d42a
