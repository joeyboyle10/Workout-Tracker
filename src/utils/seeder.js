const mongoose = require('mongoose');
require('dotenv').config();
const Exercise = require('../models/Exercise');

const exercises = [
    {
        name: 'Push-ups',
        description: 'A classic upper body exercise targeting chest, shoulders, and triceps.',
        category: 'strength',
        muscleGroup: 'chest'
    },
    {
        name: 'Squats',
        description: 'A compound lower body exercise targeting quads, hamstrings, and glutes.',
        category: 'strength',
        muscleGroup: 'chest'
    },
    {
        name: 'Running',
        description: 'Cardiovascular exercise that improves endurance and burns calories.',
        category: 'cardio',
        muscleGroup: 'full-body'
    },
    {
        name: 'Plank',
        description: 'Isometric core exercise that builds stability and strength.',
        category: 'strength',
        muscleGroup: 'core'
    },
    {
        name: 'Deadlift',
        description: 'Compound exercise targeting the posterior chain - back, glutes, hamstrings.',
        category: 'strength',
        muscleGroup: 'back'
    },
    {
        name: 'Yoga Stretch',
        description: 'Flexibility routine that improves range of motion and reduces tension.',
        category: 'flexibility',
        muscleGroup: 'full-body'
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');

        await Exercise.deleteMany({});
        console.log('Cleared existing exercises');

        await Exercise.insertMany(exercises);
        console.log('Seeded ${exercises.length} exercises');

        process.exit(0);
    } catch (error) {
        console.error(' Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();