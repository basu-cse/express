const express = require('express');
const Joi = require('joi');
const uuid = require('uuid');

const router = express.Router();

// Store tasks in memory as an object for simplicity
const tasks = {};

// Validation schema for task
const taskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    priority: Joi.string().required(),
    assignedUsers: Joi.string().required(),
});

// Middleware for logging requests and responses
router.use((req, res, next) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${
        res.statusCode
      }`
    );
    next();
});

// Utility to validate a task
function validateTask(task) {
    const result = taskSchema.validate(task);
    console.log(result);
    if (result.error) {
        return result.error.details[0].message;
    }
    return null;
}

// CREATE task
router.post('/', (req, res) => {
    const error = validateTask(req.body);
    if (error) {
        return res.status(400).send({ error: "Invalid task data", details: error.replace(/^\s+/, '') });
    }
    const id = uuid.v4(); // Generate unique id
    tasks[id] = { id, ...req.body };
    res.status(201).send(tasks[id]);
});

// READ all tasks
router.get('/', (req, res) => {
    res.json(Object.values(tasks));
});

// READ task by id
router.get('/:id', (req, res) => {
    const task = tasks[req.params.id];
    if (!task) {
        return res.status(404).send({ error: 'Task not found' });
    }
    res.json(task);
});


// UPDATE task by id
router.put('/:id', (req, res) => {
    const error = validateTask(req.body);
    if (error) {
        return res.status(400).send({ error: "Invalid task data" });
    }
    const task = tasks[req.params.id];
    if (!task) {
        return res.status(404).send({ error: 'Task not found' });
    }
    tasks[req.params.id] = { ...task, ...req.body };
    res.json(tasks[req.params.id]);
});

// DELETE task by id
router.delete('/:id', (req, res) => {
    const task = tasks[req.params.id];
    if (!task) {
        return res.status(404).send({ error: 'Task not found' });
    }
    delete tasks[req.params.id];
    res.status(204).end();
});

module.exports = router;