const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout,
    getReport
} = require('../controllers/workoutController');

router.use(protect);

router.route('/')
    .get(getWorkouts)
    .post(createWorkout);

router.route('/report')
    .get(getReport);

router.route('/:id')
    .get(getWorkout)
    .put(updateWorkout)
    .delete(deleteWorkout)

module.exports = router;