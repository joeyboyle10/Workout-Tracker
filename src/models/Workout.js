const mongoose = require('mongoose');

const workoutExerciseSchema = new mongoose.Schema({
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    sets: {
        type: Number,
        required: true,
        min: 1
    },
    reps: {
        type: Number,
        required: true,
        min: 1
    },
    weight: {
        type: Number,
        default: 0
    },
    notes: String
});

const workoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Workout must have a title'],
        trim: true
    },
    exercises: [workoutExerciseSchema],
    scheduledAt: {
        type: Date,
        required: true
    },
    completedAt: Date,
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    comments: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

workoutSchema.index({ user: 1, scheduledAt: -1 });

module.exports = mongoose.model('Workout', workoutSchema);