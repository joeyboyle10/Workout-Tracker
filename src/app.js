const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Workout Tracker API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            workouts: '/api/workouts',
            exercises: '/api/exercises'
        }
    });
});

/**************************************************** */
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'This route works without database!',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime()
    });
});

app.post('/api/echo', (req, res) => {
    res.json({
        success: true,
        message: 'Echo endpoint',
        received: req.body
    });
});

/**************************************************** */

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        startServer();
    })
    .catch(err => {
        console.error('Database connection error:', err.message);
        console.log('Starting server without database connection (for testing only)');
        console.log('Routes requiring database will fail until MongoDB is connected');
        startServer();
    });

function startServer() {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;