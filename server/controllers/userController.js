const pool = require('../model/db');

exports.viewEmployee = async (req, res) => {
    try {
        // Thực hiện truy vấn
        const [rows] = await pool.query('SELECT * FROM nhanvien');

        console.log('Dữ liệu từ bảng nhanvien:', rows);
        
        // Trả dữ liệu về dưới dạng JSON hoặc render ra view tùy mục đích
        res.json(rows); // Hoặc res.render('home', { rows }); nếu dùng template engine
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err.message);
        res.status(500).send('Lỗi server');
    }
};

exports.viewChinhanh = async (req, res) => {
    try {
        // Thực hiện truy vấn
        const [rows] = await pool.query('SELECT * FROM chinhanh');

        console.log('Dữ liệu từ bảng nhanvien:', rows);
        
        // Trả dữ liệu về dưới dạng JSON hoặc render ra view tùy mục đích
        res.json(rows); // Hoặc res.render('home', { rows }); nếu dùng template engine
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err.message);
        res.status(500).send('Lỗi server');
    }
};

exports.viewCuahang = async (req, res) => {
    try {
        // Thực hiện truy vấn
        const [rows] = await pool.query('SELECT * FROM cuahang');

        console.log('Dữ liệu từ bảng nhanvien:', rows);
        
        // Trả dữ liệu về dưới dạng JSON hoặc render ra view tùy mục đích
        res.json(rows); // Hoặc res.render('home', { rows }); nếu dùng template engine
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err.message);
        res.status(500).send('Lỗi server');
    }
};

exports.viewKhohang = async (req, res) => {
    try {
        // Thực hiện truy vấn
        const [rows] = await pool.query('SELECT * FROM khohang');

        console.log('Dữ liệu từ bảng nhanvien:', rows);
        
        // Trả dữ liệu về dưới dạng JSON hoặc render ra view tùy mục đích
        res.json(rows); // Hoặc res.render('home', { rows }); nếu dùng template engine
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err.message);
        res.status(500).send('Lỗi server');
    }
};

exports.getNameStore = async (req, res) => {
    try {
        // Lấy tham số MaNV từ URL
        const { MaNV } = req.params;

        // Gọi hàm MySQL GetNameStore
        const [rows] = await pool.query('SELECT GetNameStore(?) AS result', [MaNV]);

        console.log('Kết quả trả về từ hàm GetNameStore:', rows[0]?.result);

        // Trả kết quả về client
        res.json({ result: rows[0]?.result || 'Không tìm thấy dữ liệu' });
    } catch (err) {
        console.error('Lỗi khi gọi hàm MySQL GetNameStore:', err.message);
        res.status(500).send('Lỗi server');
    }
};
exports.deleteEmployee = async (req, res) => {
    try {
        // Lấy mã nhân viên từ params
        const { MaNV } = req.params;

        // Gọi stored procedure DeleteNhanVien
        await pool.query('CALL DeleteNhanVien(?, @message)', [MaNV]);

        // Lấy thông báo từ biến OUT @message
        const [messageResult] = await pool.query('SELECT @message AS message');
        const message = messageResult[0]?.message || 'Không có thông báo';

        console.log('Thông báo từ stored procedure:', message);

        // Trả thông báo về client
        res.json({ message });
    } catch (err) {
        console.error('Lỗi khi xóa nhân viên:', err.message);
        res.status(500).send('Lỗi server');
    }
};

exports.addEmployee = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { MaNV, TenNV, ChucVu } = req.body;

        // Gọi stored procedure hoặc query để thêm nhân viên mới
        await pool.query('CALL AddNhanVien(?, ?, ?, @message)', [MaNV, TenNV, ChucVu]);

        // Lấy thông báo từ biến OUT @message
        const [messageResult] = await pool.query('SELECT @message AS message');
        const message = messageResult[0]?.message || 'Không có thông báo';

        console.log('Thông báo từ stored procedure:', message);

        // Trả thông báo về client
        res.json({ message });
    } catch (err) {
        console.error('Lỗi khi thêm nhân viên:', err.message);
        res.status(500).send('Lỗi server');
    }
};
