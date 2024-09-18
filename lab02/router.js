const express = require("express");
const path = require('path');
const router = express.Router();

router.get("/name", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "name.html"));
});

router.get("/greeting", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "greeting.html"));
});

router.get("/add/:x-:y", (req, res) => {
    let result = Number(req.params["x"]) + Number(req.params["y"]);
    res.send(`${req.params["x"]} + ${req.params["y"]} = ${result}`);
});

router.get("/calculate/:operation/:a.:b", (req, res) => {
    switch(req.params["operation"]){
        case "+":
            result = Number(req.params["a"]) + Number(req.params["b"]);
            break;
        case "-":
            result = Number(req.params["a"]) - Number(req.params["b"]);
            break;
        case "*":
            result = Number(req.params["a"]) * Number(req.params["b"]);
            break;
        case "/":
            result = Number(req.params["a"]) / Number(req.params["b"]);
            break;
        case "**":
            result = Number(req.params["a"]) ** Number(req.params["b"]);
            break;
    }
    res.send(`${req.params["a"]} ${req.params["operation"]} ${req.params["b"]} = ${result}`);
});

module.exports = router;