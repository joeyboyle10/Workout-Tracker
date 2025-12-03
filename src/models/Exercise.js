const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Exercise must have a name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Exercise must have a description'],
    },
    category: {
        type: String,
        required: true,
        enum: ['cardio', 'strength', 'flexibility', 'balance'],
    },
    muscleGroup: {
        type: String,
        required: true,
        enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full-body']
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);