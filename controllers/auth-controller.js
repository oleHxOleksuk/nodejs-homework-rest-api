const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const {nanoid} = require("nanoid");

const { ctrlWrapper } = require("../utils");
const { HttpError, sendMail } = require("../helpers");
const { User } = require("../models/user")

const {SECRET_KEY, BASE_URL} = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async(req, res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpError(400, "Email already in use")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const avatarURL = gravatar.url({ email });
    const verificationCode = nanoid();

    const result = await User.create({...req.body, password: hashPassword,  avatarURL, verificationCode});

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}"> Verify email </a>`
    };
    await sendMail(verifyEmail);

    res.status(201).json({
        email: result.email,
        subscription: result.subscription,
    })
}

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Email or Password invalid")
    }
    if(!user.verify){
        throw HttpError(401, "Email not verify")
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if(!passwordCompare){
        throw HttpError(401, "Email or Password invalid")
    }
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY,{expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});
    res.json({token})
}

const getCurrent = async(req, res) => {
    const {email,subscription} = req.user;
    res.json({
        email,
        subscription,
    })
}

const updateSubscription = async (req, res) => {
    const { subscription } = req.user;
    const result = await User.findOneAndUpdate(subscription, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  };

const logout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""}) 
    res.json({
        message: "Logout success"
    })
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
  
    const avatarName = `${_id}_${filename}`;
    const resultUpload = path.join(avatarDir, avatarName);
  
    const optimizeAvatar = await Jimp.read(tempUpload);
    optimizeAvatar
      .resize(250, 250)
      .quality(60)
      .write(resultUpload);
    await fs.unlink(tempUpload);
  
    const avatarURL = path.join("avatars", avatarName);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
  };

const verify =  async(req, res) => {
    const {verificationCode} = req.params;
    const user = await User.findOne({verificationCode});
    if(!user){
        throw HttpError(404, "Email is not found")
    }
    await User.findByIdAndUpdate(user._id, {verify:true, verificationCode:""})
    res.json({
        message: "Email verify success"
    })
}

const resendVerifyEmail = async(req, res) => {
    const{email} = req.body;
    const user = await User.findById({email});
    if(!user) {
        throw HttpError(404, "Email is not found")
    }
    if(user.verify) {
        throw HttpError(400, "Email already verify")
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}"> Verify email </a>`
    };
    await sendMail(verifyEmail);
    res.json({
        message: "Email resend success"
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}