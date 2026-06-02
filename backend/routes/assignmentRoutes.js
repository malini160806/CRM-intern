const express = require('express');
const router = express.Router();
const { 
  assignSalesPersonToLead, 
  assignLeadToSalesPerson 
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin assigns Sales Person to Sales Lead
router.post(
  '/salesperson', 
  protect, 
  authorize('admin', 'CEO'), 
  assignSalesPersonToLead
);

// Sales Lead (or Admin) assigns CRM Lead to Sales Person
router.post(
  '/lead', 
  protect, 
  authorize('admin', 'CEO', 'salesLead', 'SalesLead'), 
  assignLeadToSalesPerson
);

module.exports = router;
