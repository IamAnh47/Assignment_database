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
exports.logout = async (req, res) => {
     req.session.destroy( async (err) => {
        if (err) {
            console.error('Lỗi khi xóa session:', err.message);
            return res.status(500).send('Không thể đăng xuất. Vui lòng thử lại!');
        }

        // Xóa cookie
        res.clearCookie('rememberedUser');
        res.clearCookie('rememberedPassword');

        // Ngăn lưu cache
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');

        // Chuyển hướng về trang login
        res.redirect('/api/login');
    });
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


// Add Employee
exports.addEmployee = async (req, res) => {
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
        const hasPrivilege = await checkUserPrivileges(username, host, db, 'insert');
        if (!hasPrivilege) {
            console.warn(`User ${username} does not have 'insert' privilege.`);
            return res.status(403).json({ message: `${hasPrivilege} Bạn không có quyền xem thông tin cửa hàng!` });
        }

        // const { MaNV, CCCD, Ho, Ten, NamSinh, GioiTinh, DiaChi, ChucVu, NgayBatDauLam, Luong, IDCuaHang, IDKho, IDChiNhanh } = req.body;
        const { maNV, cccd, ho, ten, ngaysinh, gioitinh, sdt, stk, email, diachi, chucVu, ngaydilam, luong, idChiNhanh, idCuaHang, idKho } = req.body;
        // console.log('maNV:', maNV);
        // console.log('cccdnv:', cccd);
        // console.log('ho:', ho);
        // console.log('ten:', ten);
        // console.log('ngaysinh:', ngaysinh);
        // console.log('gioitinh:', gioitinh);
        // console.log('sdt:', sdt);
        // console.log('stk:', stk);
        // console.log('email:', email);
        // console.log('diachi:', diachi);
        // console.log('chucVu:', chucVu);
        // console.log('ngaydilam:', ngaydilam);
        // console.log('luong:', luong);
        // console.log('idChiNhanh:', idChiNhanh);
        // console.log('idCuaHang:', idCuaHang);
        // console.log('idKho:', idKho);
        // console.log('Received data from frontend:', req.body); // In ra dữ liệu nhận được từ client

        try {
            // console.log('ok');
            const result = await pool.query('CALL add_employee(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                maNV, cccd, ho, ten, ngaysinh, gioitinh, diachi, chucVu, ngaydilam, luong, idCuaHang, idKho, idChiNhanh
            ]);
    
            res.status(200).json({ message: 'Employee added successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error adding employee', error: error.message });
        }
    } catch (err) {
        console.error(`Error fetching CuaHang for username: ${username}`, err.message);
        res.status(500).send('Lỗi server');
    }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
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
        const hasPrivilege = await checkUserPrivileges(username, host, db, 'delete');
        if (!hasPrivilege) {
            console.warn(`User ${username} does not have 'delete'); privilege.`);
            return res.status(403).json({ message: `${hasPrivilege} Bạn không có quyền xem thông tin cửa hàng!` });
        }

        const { MaNV } = req.params;

        try {
            const result = await pool.query('CALL delete_employee(?)', [MaNV]);
            res.status(200).json({ message: 'Employee deleted successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting employee', error: error.message });
        }
    } catch (err) {
        console.error(`Error fetching CuaHang for username: ${username}`, err.message);
        res.status(500).send('Lỗi server');
    }

};

// Update Employee
exports.updateEmployee = async (req, res) => {
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
        const hasPrivilege = await checkUserPrivileges(username, host, db, 'update');
        if (!hasPrivilege) {
            console.warn(`User ${username} does not have 'update'); privilege.`);
            return res.status(403).json({ message: `${hasPrivilege} Bạn không có quyền xem thông tin cửa hàng!` });
        }

        const { maNV, ho, ten, ngaysinh, gioitinh, sdt, stk, email, diachi, chucVu, ngaydilam, luong, idChiNhanh, idCuaHang, idKho } = req.body;
        console.log('maNV:', maNV);
        console.log('ho:', ho);
        console.log('ten:', ten);
        console.log('ngaysinh:', ngaysinh);
        console.log('gioitinh:', gioitinh);
        console.log('sdt:', sdt);
        console.log('stk:', stk);
        console.log('email:', email);
        console.log('diachi:', diachi);
        console.log('chucVu:', chucVu);
        console.log('ngaydilam:', ngaydilam);
        console.log('luong:', luong);
        console.log('idChiNhanh:', idChiNhanh);
        console.log('idCuaHang:', idCuaHang);
        console.log('idKho:', idKho);
        console.log('Received data from frontend:', req.body); // In ra dữ liệu nhận được từ client
        try {
            const result = await pool.query('CALL update_employee(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                maNV, ho, ten, ngaysinh, gioitinh, diachi, chucVu, ngaydilam, luong, idCuaHang, idKho, idChiNhanh
            ]);
            res.status(200).json({ message: 'Employee updated successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error updating employee', error: error.message });
        }
    } catch (err) {
        console.error(`Error fetching CuaHang for username: ${username}`, err.message);
        res.status(500).send('Lỗi server');
    }
};