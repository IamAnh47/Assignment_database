// utils/authUtils.js
const pool = require('../model/db');

const checkUserPrivileges = async (username, host, db, privilegeType) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                CASE 
                    WHEN ? = 'Select' THEN Select_priv = 'Y'
                    WHEN ? = 'Insert' THEN Insert_priv = 'Y'
                    WHEN ? = 'Update' THEN Update_priv = 'Y'
                    WHEN ? = 'Delete' THEN Delete_priv = 'Y'
                    ELSE 0
                END AS hasPrivilege 
             FROM mysql.db 
             WHERE user = ? 
               AND host = ? 
               AND db = ?`,
            [privilegeType, privilegeType, privilegeType, privilegeType, username, host, db]
        );

        return rows[0]?.hasPrivilege === 1;
    } catch (err) {
        console.error('Lỗi khi kiểm tra quyền:', err.message);
        throw new Error('Lỗi khi kiểm tra quyền');
    }
};


module.exports = { checkUserPrivileges };
