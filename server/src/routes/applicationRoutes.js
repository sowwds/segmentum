const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const jwtAuth = require('../middlewares/jwtAuth');

router.post('/applications', jwtAuth, applicationController.createApplication);
router.get('/applications', jwtAuth, applicationController.getApplications);

// GET /applications?projectId=<id> - Возвращает заявки для конкретного проекта
router.get('/applications', (req, res, next) => {
  if (req.query.projectId) {
    return jwtAuth(req, res, () => applicationController.getApplicationsByProject(req, res));
  }
  return res.status(400).json({ error: 'projectId query parameter is required' });
});

router.put('/applications', jwtAuth, applicationController.updateApplicationStatusPut);
module.exports = router;
