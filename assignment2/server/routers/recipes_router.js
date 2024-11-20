const express = require('express');
const router = express.Router();
const Recipe = require('../schemas/recipe');

router.get('/recipe', (req, res) => {
  Recipe.find()
    .then((recipes) => {
      res.json(recipes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/recipe', (req, res) => {
  const { name, description, difficulty, ingredients, steps } = req.body;
  const newRecipe = new Recipe({
    name,
    description,
    difficulty,
    ingredients,
    steps
  });

  newRecipe.save()
    .then((savedRecipe) => {
      console.log(savedRecipe);
      res.send();
    })
    .catch((err) => {
      res.status(400).send(err);
    })
});

router.get('/recipe/:id', (req, res) => {
  Recipe.findById(req.params.id)
    .then((recipe) => {
      res.json(recipe);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.put('/recipe/:id', (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body)
    .then((recipe) => {
      console.log(recipe);
      res.send();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.delete('/recipe/:id', (req, res) => {
  Recipe.findByIdAndDelete(req.params.id)
    .then((recipe) => {
      console.log(recipe);
      res.send();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;