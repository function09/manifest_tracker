import Router from "express";
import convertPDFtoText from "../services/pdfParse.js";
import createMaterialAndBatchID from "../services/pdfParse.js";

const source = "app/services/test.pdf";

const router = Router();

router.get("/", (req, res, next) => {
  createMaterialAndBatchID(source);
  res.send("GET route to display all manifests");
});

router.post("/upload", (req, res, next) => {
  res.send("POST route to create a new manifest object");
});

router.put("/update/:id", (req, res, next) => {
  res.send("PUT route to update manifest info");
});

router.delete("/delete/:id", (req, res, next) => {
  res.send("DELETE route to delete manifest info");
});

export default router;
