import Router from "express";
import { createMaterialAndBatchID, extractProductDescription, extractQuantity, createItem } from "../services/pdfParse.js";

const source1 = "app/services/test2.pdf";
const source2 = "app/services/test.pdf";

const router = Router();

router.get("/", (req, res, next) => {
  createItem(createMaterialAndBatchID, extractProductDescription, extractQuantity, source1);
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
