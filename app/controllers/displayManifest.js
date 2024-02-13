import { getAllManifests, getSingleManifest } from "../services/databaseFunctions.js";

const getAllDocumentsController = async (req, res) => {
  try {
    const manifests = await getAllManifests();

    if (manifests.length === 0) {
      // Do we really need this? Route will be needed to display all data on page load
      res.status(200).json({ status: "200 OK", result: "Manifests do not exist" });
    } else {
      res.status(200).json({ status: "200 OK", result: manifests });
    }
  } catch (error) {
    console.log(error);
  }
};

const getSingleDocumentController = async (req, res) => {
  try {
    const manifest = await getSingleManifest(req.params.id);

    if (manifest === null) {
      res.status(404).json({ status: "404 not found", result: "Manifest does not exist" });
    } else {
      res.status(200).json({ status: "200 OK", result: manifest });
    }
  } catch (error) {
    console.log(error);
  }
};

export { getAllDocumentsController, getSingleDocumentController };
