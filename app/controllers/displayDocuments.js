import { getAllManifests, getSingleManifest } from "../services/databaseFunctions.js";

const getAllDocumentsController = async (req, res) => {
  try {
    res.status(200).json({ status: "200 OK", manifests: await getAllManifests() });
  } catch (error) {
    console.log(error);
  }
};

const getSingleDocumentController = async (req, res) => {
  try {
    const document = await getSingleManifest(req.params.id);

    if (document === null) {
      return res.status(404).json({ status: "404 not found", result: "Manifest does not exist" });
    }
    return res.status(200).json({ status: "200 OK", manifest: document });
  } catch (error) {
    console.log(error);
  }
};

export { getAllDocumentsController, getSingleDocumentController };
