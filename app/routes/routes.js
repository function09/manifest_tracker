import Router from "express";
import multer from "multer";
import uploadFile from "../controllers/uploadManifest.js";
import { deleteDocument, getAllDocumentsJSON, getSingleDocumentJSON } from "../controllers/displayDocuments.js";
import { deleteManifest } from "../services/databaseFunctions.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllDocumentsJSON);

router.get("/:id", getSingleDocumentJSON);

router.post("/upload", upload.single("file"), uploadFile);

/* 
Typically only need to keep track of the material doc number 
after submitting manifests, no need to update everything else
*/

router.put("/update/:id", (req, res, next) => {
  res.send("PUT route to update manifest info");
});

router.delete("/delete/:id", deleteDocument);

export default router;
