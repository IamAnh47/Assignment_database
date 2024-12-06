const bcrypt = require('bcrypt');
const { checkUserPrivileges } = require('../utils/authUtils');
const pool = require('../model/db');
exports.login = async (req, res) => {
    const { username, password, remember } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.user = { id: user.id, username: user.username };

                // Lưu vào cookie nếu "Remember Me" được chọn
                if (remember) {
                    res.cookie('rememberedUser', username, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Lưu 30 ngày
                    res.cookie('rememberedPassword', password, { maxAge: 30 * 24 * 60 * 60 * 1000 });
                } else {
                    res.clearCookie('rememberedUser');
                    res.clearCookie('rememberedPassword');
                }

                return res.redirect('/api/home');
            }
        }
        res.render('login', { username, password, error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
    } catch (err) {
        console.error('Lỗi khi đăng nhập:', err.message);
        res.status(500).send('Lỗi server!');
    }
};


exports.viewNhanvien = async (req, res) => {
    const UserID = req.session.user?.id;
    const username = req.session.user?.username;

    if (!UserID || !username) {
        console.warn('Unauthorized access attempt');
        return res.status(403).json({ message: 'Bạn chưa đăng nhập' });
    }

    try {
        console.info(`Fetching NhanVien for username: ${username}`);

        const host = 'localhost'; // Update as needed
        const db = process.env.DB_NAME;

        // Check 'Select' privilege
        const hasPrivilege = await checkUserPrivileges(username, host, db, 'Select');
        if (!hasPrivilege) {
            console.warn(`User ${username} does not have 'Select' privilege.`);
            return res.status(403).json({ message: `${hasPrivilege} Bạn không có quyền xem thông tin nhân viên!` });
        }

        const [result] = await pool.query('SELECT * FROM NhanVien');
        res.json({ data: result, message: 'Dữ liệu nhân viên đã được truy xuất thành công.' });
    } catch (err) {
        console.error(`Error fetching NhanVien for username: ${username}`, err.message);
        res.status(500).send('Lỗi server');
    }
};



exports.viewChinhanh = async (req, res) => {
    const UserID = req.session.user?.id;
    const username = req.session.user?.username;

    if (!UserID || !username) {
        console.warn('Unauthorized access attempt');
        return res.status(403).json({ message: 'Bạn chưa đăng nhập' });
    }

    try {
        console.info(`Fetching ChiNhanh for username: ${username}`);

        const host = 'localhost';
        const db = process.env.DB_NAME;

        // Check 'Select' privilege
        const hasPrivilege = await checkUserPrivileges(username, host, db, 'Select');
        if (!hasPrivilege) {
            console.warn(`User ${username} does not have 'Select' privilege.`);
            return res.status(403).json({ message: `${hasPrivilege} Bạn không có quyền xem thông tin chi nhánh!` });
        }

        const [result] = await pool.query('SELECT * FROM ChiNhanh');
        res.json({ data: result, message: 'Dữ liệu chi nhánh đã được truy xuất thành công.' });
    } catch (err) {
        console.error(`Error fetching ChiNhanh for username: ${username}`, err.message);
        res.status(500).send('Lỗi server');
    }
};


exports.viewCuahang = async (req, res) => {
    const UserID = req.session.user?.id;
    const username = req.session.user?.username;

    if (!UserID || !username) {
        console.warn('Unauthorized access attempt');
        return res.status(403).json({ message: 'Bạn chưa đăng nhập' });
    }

    try {
        console.info(`Fetching CuaHang for username: ${username}`);

        const host = 'localhost';
        const db = process.env.DB_NAME;

        // Check 'Select' privilege
        const hasPrivilege = await checkUserPrivileges(username, host, db, 'Select');
        if (!hasPrivilege) {
            console.warn(`User ${username} does not have 'Select' privilege.`);
            return res.status(403).json({ message: `${hasPrivilege} Bạn không có quyền xem thông tin cửa hàng!` });
        }

        const [result] = await pool.query('SELECT * FROM CuaHang');
        res.json({ data: result, message: 'Dữ liệu cửa hàng đã được truy xuất thành công.' });
    } catch (err) {
        console.error(`Error fetching CuaHang for username: ${username}`, err.message);
        res.status(500).send('Lỗi server');
    }
};


exports.viewKho = async (req, res) => {
    const UserID = req.session.user?.id;
    const username = req.session.user?.username;

    if (!UserID || !username) {
        console.warn('Unauthorized access attempt');
        return res.status(403).json({ message: 'Bạn chưa đăng nhập' });
    }

    try {
        console.info(`Fetching Kho for username: ${username}`);

        const host = 'localhost';
        const db = process.env.DB_NAME;

        // Check 'Select' privilege
        const hasPrivilege = await checkUserPrivileges(username, host, db, 'Select');
        if (!hasPrivilege) {
            console.warn(`User ${username} does not have 'Select' privilege.`);
            return res.status(403).json({ message: `${hasPrivilege} Bạn không có quyền xem thông tin kho hàng!` });
        }

        const [result] = await pool.query('SELECT * FROM Khohang');
        res.json({ data: result, message: 'Dữ liệu kho hàng đã được truy xuất thành công.' });
    } catch (err) {
        console.error(`Error fetching Kho for username: ${username}`, err.message);
        res.status(500).send('Lỗi server');
    }
};

