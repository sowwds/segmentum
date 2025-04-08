const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');


router.get('/departments', departmentController.getDepartments);

module.exports = router;
