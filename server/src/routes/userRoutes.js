const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/account', userController.getAccount);

router.post('/account/department', userController.updateDepartment);

module.exports = router;
