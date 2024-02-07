import Router from "express";
import multer from "multer";
import uploadFile from "../controllers/uploadManifest.js";
import getAllDocumentsJSON from "../controllers/displayDocuments.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllDocumentsJSON);

router.get("/:id", (req, res) => {
  res.send("GET route to display a single manifest");
});

router.post("/upload", upload.single("file"), uploadFile);

router.put("/update/:id", (req, res, next) => {
  res.send("PUT route to update manifest info");
});

router.delete("/delete/:id", (req, res, next) => {
  res.send("DELETE route to delete manifest info");
});

export default router;
