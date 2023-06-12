const express = require("express");
const router = express.Router();
const uuid = require('uuid');
const Joi = require("joi");


// Sample data storage
let assignedTask = [];
  // ...other tasks


// Validation schema
const assignedTaskSchema = Joi.object({
    userId: Joi.string().required(),
    taskId: Joi.string().required(), 
});

// Utility to validate a assignment
function validateAssignemnt(assignment) {
  const result = assignedTaskSchema.validate(assignment);
  if (result.error) {
  return result.error.details[0].message;
  }
  return null;
}


// Assign task
const assignTask = (payload) => {
  assignedTask.push(payload);
};

// Unassign task
const unassignTask = (id) => {
  assignedTask.filter(assignedTask => assignedTask.id !== id);
};

// get user tasks
const getUserTasks = (userId) => {
  assignedTask.filter(assignedTask => assignedTask.userId === userId);
};

// Get all assigned tasks
router.get('/', (req, res) => {
  res.json(assignedTask);
});


// Endpoint to assign a task to a user
router.post("/", (req, res) => {
  const error = validateAssignemnt(req.body);
  if (error) {
  return res.status(400).send({ error: "Invalid data", details: error.replace(/^\s+/, '') });
  }
  
  const payload = {
      id: uuid.v4(),// Generate unique id
      ...req.body,
  }

  assignTask(payload);
  res.status(200).json(assignedTask);
});

// Unassigned task by id
router.delete('/:id', (req, res) => {
  unassignTask(req.params.id);
  res.json(assignedTask);
});

// Retrieve a specific user
router.get('/:id', (req, res) => {
  getUserTasks(req.params.id);
  res.status(200).json(assignedTask);
});



module.exports = router;