import { body, validationResult } from "express-validator";
import { updateManifest } from "../services/databaseFunctions.js";

const validationChain = body("materialDocNumber")
  .trim()
  .isNumeric()
  .withMessage("Material document number can only contain numerical characters")
  .isLength({ min: 10, max: 10 })
  .withMessage("Material document number must be 10 characters long")
  .escape();

const updateDocumentController = [
  validationChain,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      const findAndUpdateManifest = await updateManifest(req.params.id, req.body.materialDocNumber);

      if (!errors.isEmpty()) {
        res.status(422).json({ Status: "422 Unprocessable Content", Result: errors.array() });
      } else {
        res.status(200).json({ Status: "200 OK", Result: findAndUpdateManifest });
      }
    } catch (error) {
      console.log(error);
    }
  },
];

export default updateDocumentController;
