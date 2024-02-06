import Router from "express";
import multer from "multer";
import verifyFile from "../controllers/uploadManifest.js";
import verifyFileInput from "../controllers/uploadManifest.js";
import { checkIfDocumentExists } from "../services/databaseFunctions.js";
import uploadFile from "../controllers/uploadManifest.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", (req, res, next) => {
  res.send("GET route to display all manifests");
});

router.post("/upload", upload.single("file"), uploadFile);

router.put("/update/:id", (req, res, next) => {
  res.send("PUT route to update manifest info");
});

router.delete("/delete/:id", (req, res, next) => {
  res.send("DELETE route to delete manifest info");
});

export default router;
