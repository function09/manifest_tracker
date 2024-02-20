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
    const errors = validationResult(req);
    const findAndUpdateManifest = await updateManifest(req.params.id, req.body.materialDocNumber);

    try {
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
      }

      if (!findAndUpdateManifest) {
        return res.status(404).json({ message: "manifest does not exist" });
      }

      return res.status(200).json({ message: findAndUpdateManifest });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
];

export default updateDocumentController;
