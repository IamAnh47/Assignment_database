const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const hashController = require('../controllers/hashController');
// const permissionMiddleware = require('../middlewares/permissionMiddleware');
router.get('/login', (req, res) => {
    // Lấy thông tin username và password từ cookie hoặc gán giá trị mặc định
    const rememberedUser = req.cookies.rememberedUser || ''; // Lấy username từ cookie nếu có
    const rememberedPassword = req.cookies.rememberedPassword || ''; // Lấy password từ cookie nếu có

    // Render trang login với giá trị username và password (mặc định là rỗng nếu chưa lưu)
    res.render('login', { username: rememberedUser, password: rememberedPassword });
});


router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/home', authMiddleware, (req, res) => {
    res.render('home', { username: req.session.user.username });
});
router.get('/hash', hashController.renderHashTool);
router.post('/hash/create', hashController.createUser); 
router.post('/hash/hash_existing', hashController.hashExistingUserPassword);
router.post('/hash/delete', hashController.deleteUser);

router.get('/nhanvien', userController.viewNhanvien);
router.get('/chinhanh', userController.viewChinhanh);
router.get('/cuahang', userController.viewCuahang);
router.get('/khohang', userController.viewKho);


router.post('/nhanvien/add', userController.addEmployee);

router.post('/nhanvien/delete/:MaNV', userController.deleteEmployee);
router.patch('/nhanvien/update', userController.updateEmployee);

module.exports = router;
