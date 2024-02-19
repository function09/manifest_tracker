import { checkIfManifestExists, saveManifest } from "../services/databaseFunctions.js";

/* 
Before uploading, check if:
a file was selected,  
document # already exists in db,
if the file is a pdf file,
*/

const verifyFileInput = (req) => {
  const { file } = req;

  if (!file) {
    return true;
  }

  return false;
};

// use early returns
const verifyFileSignature = (req) => {
  const { buffer } = req.file;
  const bufferToString = Buffer.from(buffer).toString();
  const byteArray = [...bufferToString].slice(0, 5);

  // File must contain the unique signature of %PDF- in it's buffer
  if (byteArray.toString() !== "%,P,D,F,-") {
    return true;
  }

  return false;
};

// Respond with appropriate HTTP codes, appropriate JSON, clean this up, and handle errors appropriately
// refactor to use if statements
const uploadDocumentController = async (req, res) => {
  if (verifyFileInput(req)) {
    return res.status(200).json({ message: "No file has been selected" });
  }

  if (verifyFileSignature(req)) {
    return res.status(200).json({ message: "Verify that the correct file type has been submitted (.pdf)" });
  }

  if (await checkIfManifestExists(req.file.buffer)) {
    return res.status(200).json({ message: "Document number already exists" });
  }

  await saveManifest(req.file.buffer);

  return res.status(200).json({ message: "Document saved successfully" });
};

export default uploadDocumentController;
