const Exercise = require('../models/Exercise');

const getExercises = async (req, res) => {
    try {
        const { category, muscleGroup } = req.query;

        const query = {};
        if (category) query.category = category;
        if (muscleGroup) query.muscleGroup = muscleGroup;

        const exercises = await Exercise.find(query).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: exercises.length,
            data: { exercises }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching exercises',
            error: error.message
        });
    }
};

const getExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
    
        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Exercise not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { exercise }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching exercise',
            error: error.message
        });
    }
};

module.exports = { getExercises, getExercise };