const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const jwtAuth = require('../middlewares/jwtAuth');

router.get('/departments', jwtAuth, departmentController.getDepartments);

module.exports = router;
