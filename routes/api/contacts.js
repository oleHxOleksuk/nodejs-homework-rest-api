const express = require("express");

const ctrl = require("../../controllers/contacts-controller")

const {validateBody} = require("../../utils")

const schema = require("../../schema/contact")

const router = express.Router();

router.get("/", ctrl.getAllContcts);

router.get("/:contactId", ctrl.getContactById);

router.post("/",validateBody(schema.addSchema), ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put("/:contactId",validateBody(schema.addSchemaPut), ctrl.updateContact);

module.exports = router;
