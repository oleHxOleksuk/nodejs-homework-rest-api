const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../utils");

const emailRegesp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
    {
      password: {
        type: String,
        minlingth: 6,
        required: [true, "Password is required"],
      },
      email: {
        type: String,
        match: emailRegesp,
        required: [true, "Email is required"],
        unique: true,
      },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter",
      },
      token: {
        type: String,
        default: null,
      },
      avatarURL: {
        type: String,
        required: true,
      },
      verify:{
        type: String,
        required: false,
      },
      verificationCode: {
        type: String,
        default:"",
      },
    },
    { versionKey: false }
  );

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegesp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegesp).required(),
    password: Joi.string().min(6).required(),
});

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
  });

  const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegesp).required(),
});

const schemas = {
    registerSchema,
    loginSchema,
    updateSubscriptionSchema,
    emailSchema
}

const User = model("User", userSchema);

module.exports = {
    schemas,
    User
}