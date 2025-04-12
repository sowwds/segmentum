const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtAuth = require('../middlewares/jwtAuth');

router.get('/account', jwtAuth, userController.getAccount);
router.post('/account/department', jwtAuth, userController.updateDepartment);

module.exports = router;