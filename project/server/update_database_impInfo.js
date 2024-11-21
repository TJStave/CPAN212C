//This is a utility script to update the database on which jokers have been implemented
require("dotenv").config();
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const Joker = require('./schemas/joker');
const codeDirectory = path.join(__dirname, './jokerCode');

const main = async () => {
  await mongoose.connect('mongodb+srv://n01286513:' + process.env.PASSWORD + '@cluster0.pmfh9.mongodb.net/balatro?retryWrites=true&w=majority&appName=Cluster0')
}

main().catch(err => console.log(err));

let filesArray = fs.readdirSync(codeDirectory);

for (const file of filesArray){
  Joker.findOneAndUpdate({ref: path.parse(file).name, implemented: false}, {implemented: true})
    .then((joker) => {
      console.log(joker ? joker.ref : path.parse(file).name + ' already current');
    })
    .catch((err) => {
      console.log(err);
    })
}