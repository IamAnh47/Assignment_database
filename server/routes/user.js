const express = require('express');
const router  = express.Router();
const userController = require('../controllers/userController');

router.get('/nhanvien', userController.viewEmployee);
router.get('/chinhanh', userController.viewChinhanh);
router.get('/cuahang', userController.viewCuahang);
router.get('/khohang', userController.viewKhohang);

router.get('/getNameStore/:MaNV', userController.getNameStore);
router.delete('/nhanvien/:MaNV', userController.deleteEmployee);
router.post('/nhanvien', userController.addEmployee);

module.exports = router;