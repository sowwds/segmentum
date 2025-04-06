const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/applications', applicationController.createApplication);
router.get('/applications', applicationController.getApplications);

// GET /applications?projectId=<id> - Возвращает заявки для конкретного проекта
router.get('/applications', (req, res) => {
    if (req.query.projectId) {
      return applicationController.getApplicationsByProject(req, res);
    }
    return res.status(400).json({ error: 'projectId query parameter is required' });
  });

router.put('/applications', applicationController.updateApplicationStatusPut);
module.exports = router;
