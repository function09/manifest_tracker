import Router from "express";
import multer from "multer";
import uploadDocumentController from "../controllers/uploadManifest.js";
import { getAllDocumentsController, getSingleDocumentController } from "../controllers/displayDocuments.js";
import updateDocumentController from "../controllers/updateDocument.js";
import deleteDocumentController from "../controllers/deleteDocument.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllDocumentsController);

router.get("/:id", getSingleDocumentController);

router.post("/upload", upload.single("file"), uploadDocumentController);

router.put("/update/:id", updateDocumentController);

router.delete("/delete/:id", deleteDocumentController);

export default router;
