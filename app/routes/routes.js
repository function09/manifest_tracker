import Router from "express";
import multer from "multer";
import { getAllDocumentsController, getSingleDocumentController } from "../controllers/displayManifest.js";
import uploadDocumentController from "../controllers/uploadManifest.js";
import updateDocumentController from "../controllers/updateManifest.js";
import deleteDocumentController from "../controllers/deleteManifest.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllDocumentsController);

router.get("/:id", getSingleDocumentController);

router.post("/upload", upload.single("file"), uploadDocumentController);

router.put("/update/:id", updateDocumentController);

router.delete("/delete/:id", deleteDocumentController);

export default router;
