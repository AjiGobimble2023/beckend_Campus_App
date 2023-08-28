const router = require('express').Router();
const userController = require('./controller');
const multer = require('multer');
const os = require('os');
const { police_check } = require('../../middleware');

router.get('/user', userController.getUserByToken);
router.patch('/user',  multer({dest:os.tmpdir()}).single('image'),userController.updateUser);
router.patch('/user/photo',  multer({dest:os.tmpdir()}).single('image'),userController.updatePhotoUser);
router.get('/alluser',police_check('view','AllUser'),userController.getAllUsersWithRoleUser)

module.exports = router;