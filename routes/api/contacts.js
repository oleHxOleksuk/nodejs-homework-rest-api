const express = require("express");
const Joi = require("joi");

const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");

const router = express.Router();

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": '"name" is required',
    "string.empty": '"name" cannot be empty',
    "string.base": '"name" must be string',
  }),
  email: Joi.string().required().messages({
    "any.required": '"email" is required',
    "string.empty": '"email" cannot be empty',
    "string.base": '"email" must be string',
  }),
  phone: Joi.string().required().messages({
    "any.required": '"phone" is required',
    "string.empty": '"phone" cannot be empty',
    "string.base": '"phone" must be string',
  }),
});

const addSchemaPut = Joi.object({
  name: Joi.string().messages({
    "string.empty": '"name" cannot be empty',
    "string.base": '"name" must be string',
  }),
  email: Joi.string().messages({
    "string.empty": '"email" cannot be empty',
    "string.base": '"email" must be string',
  }),
  phone: Joi.string().messages({
    "string.empty": '"phone" cannot be empty',
    "string.base": '"phone" must be string',
  }),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
    console.log(error.message);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw HttpError(404, `Contact with ${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, `Contact whith id: ${contactId} not found`);
    }
    res.json({ message: "Delete success" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = addSchemaPut.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404, `Contact whith id: ${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
