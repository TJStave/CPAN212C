require("dotenv").config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const cors = require("cors");

const main = async () => {
  await mongoose.connect('mongodb+srv://n01286513:kdM1GKBuXkgE0McL@cluster0.pmfh9.mongodb.net/balatro?retryWrites=true&w=majority&appName=Cluster0')
}

main().catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const layerCake = require('./routers/layerCake.js');
const judge = require('./routers/judge.js');
const broker = require('./routers/broker.js');

app.use('/build', layerCake);
app.use('/score', judge);
app.use('/query', broker);

app.get("/", (req, res) => {
  res.send("You shouldn't be here.");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});