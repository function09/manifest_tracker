import Manifest from "../models/manifest.js";
import createManifestObject from "./pdfParse.js";

// database queries and such go here see if you can organize this better

const checkIfDocumentExists = async (buffer) => {
  let exists;

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

const getSingleDocument = async (id) => {
  try {
    return await Manifest.findOne({ UUID: id }, "-_id -__v").exec();
  } catch (error) {
    console.log(error);
  }
};

const getAllDocuments = async () => {
  try {
    /* 
    We are not including items here; 
    as the number of documents increases, 
    there will be many items -> potential slowdown 
    */

    return await Manifest.find({}, "-_id -__v -items").exec();
  } catch (error) {
    console.log(error);
  }
};

const saveManifest = async (buffer) => {
  try {
    return await new Manifest({ ...(await createManifestObject(buffer)) }).save();
  } catch (error) {
    console.log(error);
  }
};

const updateManifest = async (param, materialDocNumber) => {
  try {
    await Manifest.findOneAndUpdate({ UUID: param }, { materialDocNumber }).exec();
  } catch (error) {
    console.log(error);
  }
};

const deleteManifest = async (param) => {
  try {
    return await Manifest.findOneAndDelete({ UUID: param }).exec();
  } catch (error) {
    console.log(error);
  }
};

export {
  checkIfDocumentExists,
  getSingleDocument,
  getAllDocuments,
  createManifestObject,
  saveManifest,
  updateManifest,
  deleteManifest,
};
