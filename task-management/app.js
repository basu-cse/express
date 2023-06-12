const express = require('express');
const morgan = require('morgan');

const usersRouter = require('./routes/users');
const taskRoutes = require('./routes/task');
const categoryRoutes = require('./routes/category');
const priorityRoutes = require('./routes/priority');
const assignmentRoutes = require('./routes/assignment');

const app = express();

app.use(express.json());
app.use(morgan('tiny')); // Logging

// Routes
app.use('/users', usersRouter);
app.use('/tasks', taskRoutes);
app.use('/categories', categoryRoutes);
app.use('/priorities', priorityRoutes);
app.use('/assignments', assignmentRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));