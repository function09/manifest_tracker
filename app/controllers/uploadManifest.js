import { checkIfDocumentExists, getAllDocuments, uploadToDB } from "../services/databaseFunctions.js";
/* 
Before uploading, check if:
a file was selected,  
document # already exists in db,
if the file is a pdf file,

CLEAN EVERYTHING UP!!!!
*/

const verifyFileSignature = (file) => {
  const bufferToString = Buffer.from(file).toString();
  const byteArray = [...bufferToString].slice(0, 5);
  let check = false;

  if (byteArray.toString() === "%,P,D,F,-") {
    check = true;
  }
  return check;
};

// Respond with appropriate HTTP codes AND CLEAN UP
const uploadFile = async (req, res) => {
  switch (true) {
    case !req.file:
      res.status(200).json({ Status: "200 OK", Message: "No file has been selected" });
      break;
    case verifyFileSignature(req.file.buffer):
      try {
        if (await checkIfDocumentExists(req.file.buffer)) {
          res.status(200).json({ Status: "200 OK", Message: "Document number already exists" });
        } else {
          await uploadToDB(req.file.buffer);
          res.status(200).json({ Status: "200 OK", Result: getAllDocuments() });
        }
      } catch (error) {
        console.log(error);
      }
      break;
    default:
      res.status(200).json({ Status: "200 OK", Message: "Error processing file" });
  }
};

export default uploadFile;
