const mongoose = require("mongoose");

const app = require('./app')
// Oleh04091991

const DB_HOST = "mongodb+srv://Oleh:Oleh04091991@cluster0.8dias2d.mongodb.net/contacts-reader?retryWrites=true&w=majority"

mongoose.connect(DB_HOST)
  .then(() => app.listen(3000))
  .catch(error => console.log(error.message));


