const express = require('express');
const router = express.Router();
const { requireAuth, checkJob, checkUser } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', requireAuth, checkUser, dashboardController.dashboard);
router.get('/dashboard/item/:id', requireAuth, checkUser, checkJob, dashboardController.dashboardViewJob);
router.put('/dashboard/item/:id', requireAuth, checkUser, checkJob, dashboardController.dashboardUpdateJob);
router.delete('/dashboard/item-delete/:id', requireAuth, checkUser, checkJob, dashboardController.dashboardDeleteJob);
router.get('/dashboard/add', requireAuth, checkUser, dashboardController.dashboardAddJob);
router.post('/dashboard/add', requireAuth, checkUser, dashboardController.dashboardAddJobSubmit);
router.get('/dashboard/myProfile/:id', requireAuth, checkUser, dashboardController.myProfile);
router.put('/dashboard/myProfile/:id', requireAuth, checkUser,dashboardController.editMyProfile_put);
router.get('/dashboard/changePassword/:id', requireAuth, checkUser,dashboardController.changePassword_get);
router.put('/dashboard/changePassword/:id', requireAuth, checkUser,dashboardController.changePassword_put);

module.exports = router;