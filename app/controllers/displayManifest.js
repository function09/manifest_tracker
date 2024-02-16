import { getAllManifests, getSingleManifest } from "../services/databaseFunctions.js";

const getAllDocumentsController = async (req, res) => {
  try {
    const manifests = await getAllManifests();

    if (manifests.length === 0) {
      // Do we really need this? Route will be needed to display all data on page load
      return res.status(200).json({ result: "Manifests do not exist" });
    }
    return res.status(200).json({ result: manifests });
  } catch (error) {
    console.log(error);
  }
};

const getSingleDocumentController = async (req, res) => {
  try {
    const manifest = await getSingleManifest(req.params.id);

    if (manifest === null) {
      return res.status(404).json({ error: "Manifest does not exist" });
    }

    return res.status(200).json({ result: manifest });
  } catch (error) {
    console.log(error);
  }
};

export { getAllDocumentsController, getSingleDocumentController };
