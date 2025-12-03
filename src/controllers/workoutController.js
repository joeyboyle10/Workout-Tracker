const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

const createWorkout = async (req, res) => {
    try {
        const { title, exercises, scheduledAt, comments } = req.body;

        for (const ex of exercises) {
            const exerciseExists = await Exercise.findById(ex.exercise);
            if (!exerciseExists) {
                return res.status(400).json({
                    success: false,
                    message: `Exercise with ID ${ex.exercise} not found`
                });
            }
        }

        const workout = await Workout.create({
            user: req.user._id,
            title,
            exercises,
            scheduledAt,
            comments
        });

        res.status(201).json({
            success: true,
            message: 'Workout created successfully',
            data: { workout }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating workout',
            error: error.message
        });
    }
};

const getWorkouts = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;

        const query = { user: req.user._id };

        const workouts = await Workout.find(query)
            .populate('exercise.exercise', 'name category muscleGroup')
            .sort({ scheduledAt: -1 });

        res.status(200).json({
            success: true,
            count: workouts.length,
            data: { workouts }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching workouts',
            error: error.message
        });
    }
};

const getWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id)
            .populate('exercise.exercise');

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        if (workout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this workout'
            });
        }

        res.status(200).json({
            success: true,
            data: {workout}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching workout',
            error: error.message
        });
    }
}

const updateWorkout = async (req, res) => {
    try {
        const { title, exercises, scheduledAt, status, comments } = req.body;

        let workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        if (workout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this workout'
            });
        }

        if (title) workout.title = title;
        if (exercises) workout.exercises = exercises;
        if (scheduledAt) workout.scheduledAt = scheduledAt;
        if (status) {
            workout.status = status;
            if (status === 'completed') {
                workout.completedAt = new Date();
            }
        }
        if (comments) workout.comments = comments;

        await workout.save();

        res.status(200).json({
            success: true,
            message: 'Workout updated successfully',
            data: { workout }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating workout',
            error: error.message
        });
    }
}

const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        if (workout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this workout'
            });
        }

        await workout.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Workout deleted successfully',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: ('Error deleting workout'),
            error: error.message
        });
    }
}

const getReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate
            ? new Date(startDate)
            : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

        const report = await Workout.aggregate([
            {
                $match: {
                    user: req.user._id,
                    status: 'completed',
                    completedAt: { $gte: start, $lte: end }
                }
            },
            { $unwind: '$exercises'},
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalSets: { $sum: '$exercises.sets' },
                    totalReps: { $sum: { $multiply: ['$exercises.sets', '$exercises.reps'] } },
                    totalWeight: {
                        $sum: {
                            $multiply: ['$exercises.sets', '$exercises.reps', '$exercises.weight']
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                period: { start, end },
                summary: report[0] || { totalWorkouts: 0, totalSets: 0, totalReps: 0, totalWeight: 0},
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error producing report',
            error: error.message
        });
    }
}

module.exports = {
    createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout,
    getReport
};