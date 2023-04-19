const express = require("express");

const {isValidId, authenticate} = require("../../midlewares")

const ctrl = require("../../controllers/contacts-controller")

const {validateBody} = require("../../utils")

const {schemas} = require("../../models/contact")

const router = express.Router();

router.get("/",authenticate, ctrl.getAllContacts);

router.get("/:contactId",authenticate,isValidId, ctrl.getContactById);

router.post("/",authenticate, validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId",authenticate, isValidId, ctrl.removeContact);

router.put("/:contactId",authenticate, isValidId, validateBody(schemas.addSchemaPut), ctrl.changeContact);

router.patch("/:contactId/favorite",authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
