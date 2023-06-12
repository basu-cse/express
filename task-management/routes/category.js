const express = require('express');
const Joi = require('joi');
const uuid = require('uuid');

const router = express.Router();

// Store categories in memory as an object for simplicity
const categories = {};

// Validation schema for category
const categorySchema = Joi.object({
    name: Joi.string().required(), 
});

// Utility to validate a category
function validateCategory(category) {
    const result = categorySchema.validate(category);
    console.log(result);
    if (result.error) {
        return result.error.details[0].message;
    }
    return null;
}

// CREATE category
router.post('/', (req, res) => {
    const error = validateCategory(req.body);
    if (error) {
        return res.status(400).send({ error: "Invalid category data", details: error.replace(/^\s+/, '') });
    }
    const id = uuid.v4(); // Generate unique id
    categories[id] = { id, ...req.body };
    res.status(201).send(categories[id]);
});

// Get all categories
router.get('/', (req, res) => {
    res.json(Object.values(categories));
});

// Read category by id
router.get('/:id', (req, res) => {
    const category = categories[req.params.id];
    if (!category) {
        return res.status(404).send({ error: 'Category not found' });
    }
    res.json(category);
});


// Update a specific category
router.put('/:id', (req, res) => {
    const error = validateCategory(req.body);
    if (error) {
        return res.status(400).send({ error: "Invalid category data" });
    }
    const category = categories[req.params.id];
    if (!category) {
        return res.status(404).send({ error: 'Category not found' });
    }
    categories[req.params.id] = { ...category, ...req.body };
    res.json(categories[req.params.id]);
});

// DELETE category by id
router.delete('/:id', (req, res) => {
    const category = categories[req.params.id];
    if (!category) {
        return res.status(404).send({ error: 'Category not found' });
    }
    delete categories[req.params.id];
    res.status(204).end();
});

module.exports = router;