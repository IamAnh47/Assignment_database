function authMiddleware(req, res, next) {
    console.log('Session:', req.session);

    if (req.session && req.session.user) {
        next(); // Tiếp tục nếu đã đăng nhập
    } else {
        console.log('Chưa đăng nhập. Chuyển hướng về login.');
        res.redirect('/api/login'); // Chuyển hướng nếu chưa đăng nhập
    }
}

module.exports = authMiddleware;
