const express = require('express');
const router = express.Router();
const { getExercises, getExercise } = require('../controllers/exerciseController');

router.get('/', getExercises);
router.get('/:id', getExercise);

module.exports = router;