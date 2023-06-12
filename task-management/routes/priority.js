const express = require('express');
const Joi = require('joi');
const uuid = require('uuid');

const router = express.Router();

// Store priorities in memory as an object for simplicity
const priorities = {};

// Validation schema for priority
const prioritySchema = Joi.object({
    name: Joi.string().required(), 
});

// Utility to validate a Priority
function validatePriority(priority) {
    const result = prioritySchema.validate(priority);
    console.log(result);
    if (result.error) {
        return result.error.details[0].message;
    }
    return null;
}

// Add priority
router.post('/', (req, res) => {
    const error = validatePriority(req.body);
    if (error) {
        return res.status(400).send({ error: "Invalid priority data", details: error.replace(/^\s+/, '') });
    }
    const id = uuid.v4(); // Generate unique id
    priorities[id] = { id, ...req.body };
    res.status(201).send(priorities[id]);
});


// Retrieve all priorities
router.get('/', (req, res) => {
    res.json(Object.values(priorities));
});

// Retrieve priority by id
router.get('/:id', (req, res) => {
    const priority = priorities[req.params.id];
    if (!priority) {
        return res.status(404).send({ error: 'priority not found' });
    }
    res.json(priority);
});


// Update priority by id
router.put('/:id', (req, res) => {
    const error = validatePriority(req.body);
    if (error) {
        return res.status(400).send({ error: "Invalid priority data" });
    }
    const priority = priorities[req.params.id];
    if (!priority) {
        return res.status(404).send({ error: 'Priority not found' });
    }
    priorities[req.params.id] = { ...priority, ...req.body };
    res.json(priorities[req.params.id]);
});

// DELETE priority by id
router.delete('/:id', (req, res) => {
    const priority = priorities[req.params.id];
    if (!priority) {
        return res.status(404).send({ error: 'Priority not found' });
    }
    delete priorities[req.params.id];
    res.status(204).end();
});

module.exports = router;