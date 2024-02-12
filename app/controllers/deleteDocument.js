import { deleteManifest } from "../services/databaseFunctions.js";

const deleteDocument = async (req, res) => {
  try {
    const document = await deleteManifest(req.params.id);
    if (document) {
      res.status(200).json({ Status: "200 OK", result: "Manifest deleted successfully" });
    } else {
      res.status(404).json({ Status: "404 Not Found", result: "Document number does not exist" });
    }
  } catch (error) {
    console.log(error);
  }
};

export default deleteDocument;
