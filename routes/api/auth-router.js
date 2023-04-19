const express = require("express");

const ctrl = require("../../controllers/auth-controller")
const {validateBody} = require("../../utils");
const {schemas} = require("../../models/user");
const {authenticate} = require("../../midlewares")

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register)
router.post("/login", validateBody(schemas.loginSchema), ctrl.login)
router.get("/current", authenticate, ctrl.getCurrent)
router.post("/logout", authenticate, ctrl.logout)
router.patch("/users", authenticate, validateBody(schemas.updateSubscriptionSchema), ctrl.updateSubscription);

module.exports = router;