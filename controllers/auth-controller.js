const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const { ctrlWrapper } = require("../utils");
const { HttpError } = require("../helpers");
const {User} = require("../models/user")

const {SECRET_KEY} = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");


const register = async(req, res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpError(409, "Email already in use")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const avatarURL = gravatar.url({ email });

    const result = await User.create({...req.body, password: hashPassword,  avatarURL});

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

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar)
}