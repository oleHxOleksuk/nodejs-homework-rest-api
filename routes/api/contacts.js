const express = require("express");

const {isValidId} = require("../../midlewares")

const ctrl = require("../../controllers/contacts-controller")

const {validateBody} = require("../../utils")

const {schemas} = require("../../models/contact")

const router = express.Router();

router.get("/", ctrl.getAllContacts);

router.get("/:contactId",isValidId, ctrl.getContactById);

router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId",isValidId, ctrl.removeContact);

router.put("/:contactId", isValidId, validateBody(schemas.addSchemaPut), ctrl.changeContact);

router.patch("/:contactId/favorite", isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
