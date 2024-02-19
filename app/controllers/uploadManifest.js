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
const uploadDocumentController = async (req, res) => {
  switch (true) {
    case verifyFileInput(req):
      res.status(200).json({ message: "No file has been selected" });
      break;
    case verifyFileSignature(req):
      res.status(200).json({ message: "Verify that the correct file type has been submitted (.pdf)" });
      break;
    case await checkIfManifestExists(req.file.buffer):
      res.status(200).json({ message: "Document number already exists" });
      break;
    default:
      await saveManifest(req.file.buffer);
      res.status(200).json({ message: "Document saved successfully" });
  }
};

export default uploadDocumentController;
