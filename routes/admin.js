const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getDashboard);
router.get('/events', adminController.getEvents);
router.get('/projects', adminController.getProjects);
router.get('/publications', adminController.getPublications);
router.get('/formations', adminController.getFormations);
router.get('/chiffres', adminController.getChiffres);
router.post('/chiffres', adminController.postChiffres);
router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.postSettings);
router.get('/selection', adminController.getSelection);
router.post('/selection', adminController.postSelection);

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const mixUpload = upload.fields([{ name: 'image_file', maxCount: 1 }, { name: 'pdf_file', maxCount: 1 }]);

router.post('/projects/add', mixUpload, adminController.postAddProject);
router.post('/projects/delete/:id', adminController.postDeleteProject);

router.post('/events/add', mixUpload, adminController.postAddEvent);
router.post('/events/delete/:id', adminController.postDeleteEvent);

router.post('/publications/add', mixUpload, adminController.postAddPublication);
router.post('/publications/delete/:id', adminController.postDeletePublication);

router.post('/formations/add', mixUpload, adminController.postAddFormation);
router.post('/formations/delete/:id', adminController.postDeleteFormation);

module.exports = router;
