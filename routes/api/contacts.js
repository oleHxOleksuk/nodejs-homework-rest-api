const express = require("express");

const ctrl = require("../../controllers/contacts-controller")

const {validateBody} = require("../../utils")

const {schema} = require("../../models/contact")

const router = express.Router();

router.get("/", ctrl.getAllContacts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateBody(schema.addSchema), ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put(
  "/:contactId",
  validateBody(schema.addSchemaPut),
  ctrl.changeContact
);

router.patch(
  "/:contactId/favorite",
  validateBody(schema.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
