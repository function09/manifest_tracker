import { checkIfDocumentExists, getSingleDocument, saveManifest } from "../services/databaseFunctions.js";

/* 
Before uploading, check if:
a file was selected,  
document # already exists in db,
if the file is a pdf file,

CLEAN EVERYTHING UP!!!!
*/

const verifyFileInput = (req) => {
  const { file } = req;
  let check = false;

  // If file object is empty respond with true and handle accordingly
  if (!file) {
    check = true;
  }
  return check;
};

const verifyFileSignature = (req) => {
  const { buffer } = req.file;
  const bufferToString = Buffer.from(buffer).toString();
  const byteArray = [...bufferToString].slice(0, 5);
  let check = false;

  // File must contain the unique signature of %PDF- in it's buffer
  if (byteArray.toString() === "%,P,D,F,-") {
    check = true;
  }
  return check;
};

// Respond with appropriate HTTP codes, appropriate JSON, clean this up, and handle errors appropriately
const uploadFile = async (req, res) => {
  switch (true) {
    case verifyFileInput(req):
      res.status(200).json({ Result: "No file has been selected" });
      break;
    case verifyFileSignature(req):
      try {
        if (await checkIfDocumentExists(req)) {
          res.status(200).json({ Result: "Document number already exists" });
        } else {
          await saveManifest(req);
          res.status(200).json({ Message: "200 OK" });
        }
      } catch (error) {
        console.log(error);
      }
      break;
    default:
      res.status(200).json({ Result: "Error processing file: Verify that the correct file type has been submitted (pdf)" });
  }
};

export default uploadFile;
