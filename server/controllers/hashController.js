const bcrypt = require('bcrypt');
const pool = require('../model/db');
const path = require('path');
const fs = require('fs');
const historyFilePathCreate = path.join(__dirname, '../logs/user_creation_history.json');
const historyFilePathHash = path.join(__dirname, '../logs/password_hash_history.json');
const historyFilePathDelete = path.join(__dirname, '../logs/user_deletion_history.json');

// Trang mã hóa và lưu mật khẩu
exports.renderHashTool = (req, res) => {
    res.render('hash_tool');
};

exports.createUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).send('Không có dữ liệu gửi đến server');
    }

    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.render('hash_tool', { message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    try {
        // Kiểm tra username đã tồn tại trong bảng users
        const [userCheck] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (userCheck.length > 0) {
            return res.render('hash_tool', { message: 'Username đã tồn tại trong hệ thống!' });
        }

        // Tạo tài khoản MySQL trước
        await pool.query(`CREATE USER ?@'localhost' IDENTIFIED BY ?`, [username, password]);

        // Mã hóa mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Lưu vào bảng users
        await pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        // Cấp quyền cho user trên database với GRANT OPTION
        await pool.query(`GRANT ALL PRIVILEGES ON ${process.env.DB_NAME}.* TO ?@'localhost' WITH GRANT OPTION`, [username]);

        // Áp dụng thay đổi
        await pool.query('FLUSH PRIVILEGES');

        // Ghi lịch sử tạo tài khoản vào file JSON
        const logEntryCreate = {
            username,
            role,
            createdAt: new Date().toISOString(),
        };

        let historyDataCreate = [];
        if (fs.existsSync(historyFilePathCreate)) {
            try {
                historyDataCreate = JSON.parse(fs.readFileSync(historyFilePathCreate, 'utf-8'));
            } catch (err) {
                console.error('Lỗi khi đọc file JSON:', err.message);
            }
        }

        // Thêm vào mảng lịch sử
        historyDataCreate.push(logEntryCreate);

        // Ghi vào file JSON
        fs.writeFileSync(historyFilePathCreate, JSON.stringify(historyDataCreate, null, 4), 'utf-8');

        res.render('hash_tool', { message: 'Tài khoản đã được tạo và lưu thành công!' });
    } catch (err) {
        console.error('Lỗi khi tạo người dùng:', err.message);

        // Xử lý khi gặp lỗi (ví dụ: nếu tài khoản MySQL không thể tạo)
        if (err.message.includes('ERROR 1396')) {
            return res.render('hash_tool', { message: 'Tài khoản MySQL đã tồn tại!' });
        }

        res.status(500).send('Lỗi server!');
    }
};

// Mã hóa mật khẩu cho tài khoản đã có trong database
exports.hashExistingUserPassword = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kiểm tra xem user có tồn tại trong database không
        const [userCheck] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (userCheck.length === 0) {
            return res.render('hash_tool', { message: 'Tài khoản không tồn tại!' });
        }

        // Mã hóa mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Cập nhật mật khẩu đã mã hóa vào database
        await pool.query(
            'UPDATE users SET password = ? WHERE username = ?',
            [hashedPassword, username]
        );

        // Ghi lịch sử cập nhật vào file JSON
        const logEntryUpdate = {
            username,
            updatedAt: new Date().toISOString(),
        };

        let historyDataUpdate = [];
        if (fs.existsSync(historyFilePathHash)) {
            try {
                historyDataUpdate = JSON.parse(fs.readFileSync(historyFilePathHash, 'utf-8'));
            } catch (err) {
                console.error('Lỗi khi đọc file JSON:', err.message);
            }
        }

        historyDataUpdate.push(logEntryUpdate);

        // Ghi vào file JSON
        fs.writeFileSync(historyFilePathHash, JSON.stringify(historyDataUpdate, null, 4), 'utf-8');

        res.render('hash_tool', { message: 'Mật khẩu đã được mã hóa và cập nhật thành công!' });
    } catch (err) {
        console.error('Lỗi khi mã hóa mật khẩu:', err.message);
        // res.status(500).send('Lỗi server!');
    }
};

exports.deleteUser = async (req, res) => {
    const { username } = req.body;

    try {
        // Kiểm tra xem user có tồn tại trong bảng 'users' không
        const [userCheck] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (userCheck.length === 0) {
            return res.render('hash_tool', { message: 'Tài khoản không tồn tại!' });
        }

        // Xóa tài khoản khỏi bảng users trong cơ sở dữ liệu
        await pool.query('DELETE FROM users WHERE username = ?', [username]);

        // Xóa tài khoản MySQL
        await pool.query('DROP USER ?@\'localhost\'', [username]);

        // Áp dụng thay đổi
        await pool.query('FLUSH PRIVILEGES');

        // Ghi lịch sử xóa tài khoản vào file JSON
        const logEntryDelete = {
            username,
            deletedAt: new Date().toISOString(),
        };

        let historyData = [];
        if (fs.existsSync(historyFilePathDelete)) {
            try {
                historyData = JSON.parse(fs.readFileSync(historyFilePathDelete, 'utf-8'));
            } catch (err) {
                console.error('Lỗi khi đọc file JSON:', err.message);
            }
        }

        historyData.push(logEntryDelete);

        // Ghi lại toàn bộ mảng vào file JSON
        fs.writeFileSync(historyFilePathDelete, JSON.stringify(historyData, null, 4), 'utf-8');

        res.render('hash_tool', {
            message: 'Tài khoản đã được xóa thành công!',
            reset: true,  // Thêm một cờ để xác định reset form
        });
    } catch (err) {
        console.error('Lỗi khi xóa người dùng:', err.message);
        // res.status(500).send('Lỗi server!');
    }
};





