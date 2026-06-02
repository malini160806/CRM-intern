const express = require('express');
const router = express.Router();
const { 
  getCases, 
  getCaseById, 
  createCase, 
  updateCase, 
  deleteCase 
} = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getCases)
  .post(createCase);

router.route('/:id')
  .get(getCaseById)
  .put(updateCase)
  .delete(deleteCase);

module.exports = router;
