import Router from "express";
import multer from "multer";
import { getAllDocumentsController, getSingleDocumentController } from "../controllers/displayManifest.js";
import uploadDocumentController from "../controllers/uploadManifest.js";
import updateDocumentController from "../controllers/updateManifest.js";
import deleteDocumentController from "../controllers/deleteManifest.js";
import authenticateToken from "../middleware/authentication.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", authenticateToken, getAllDocumentsController);

router.get("/:id", authenticateToken, getSingleDocumentController);

router.post("/upload", authenticateToken, upload.single("file"), uploadDocumentController);

router.put("/update/:id", authenticateToken, updateDocumentController);

router.delete("/delete/:id", authenticateToken, deleteDocumentController);

export default router;
