const express = require('express');
const router = express.Router();
const {
  getSolutions,
  getSolutionById,
  createSolution,
  updateSolution,
  deleteSolution
} = require('../controllers/solutionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSolutions)
  .post(createSolution);

router.route('/:id')
  .get(getSolutionById)
  .put(updateSolution)
  .delete(deleteSolution);

module.exports = router;
