const nodemailer = require("nodemailer");
require("dotenv").config();

const {EMAIL_FROM, META_PASSWORD} = process.env

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465, 
    secure: true,
    auth:{
        user: EMAIL_FROM,
        pass: META_PASSWORD,
    }
};

const trasport = nodemailer.createTransport(nodemailerConfig);

const sendMail = async(data) => {
    const email = {...data, from: EMAIL_FROM};
    await trasport.sendMail(email);
    return true;
};

module.exports = sendMail;