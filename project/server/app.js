require("dotenv").config();
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const layerCake = require('./routers/layerCake.js');
const judge = require('./routers/judge.js');

app.use('/build', layerCake);
app.use('/score', judge);

app.get("/", (req, res) => {
  res.send("You shouldn't be here.");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});