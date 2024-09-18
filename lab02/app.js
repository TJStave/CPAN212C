const express = require("express");
const router = require("./router.js")
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use("/", router);

app.listen(PORT);