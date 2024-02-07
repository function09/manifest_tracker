import { getAllDocuments, getSingleDocument } from "../services/databaseFunctions.js";

const getAllDocumentsJSON = async (req, res) => {
  res.status(200).json({ status: "200 OK", manifests: await getAllDocuments() });
};

const getSingleDocumentJSON = async (req, res) => {
  try {
    const document = await getSingleDocument(req.params.id);

    if (document === null) {
      return res.status(404).json({ status: "404 not found", result: "Manifest does not exist" });
    }
    return res.status(200).json({ status: "200 OK", manifest: document });
  } catch (error) {
    console.log(error);
  }
};

export { getAllDocumentsJSON, getSingleDocumentJSON };
