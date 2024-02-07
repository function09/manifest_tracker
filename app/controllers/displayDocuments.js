import { getAllDocuments } from "../services/databaseFunctions.js";

const getAllDocumentsJSON = async (req, res) => {
  res.status(200).json({ Status: "200 OK", Manifests: await getAllDocuments() });
};

export default getAllDocumentsJSON;
