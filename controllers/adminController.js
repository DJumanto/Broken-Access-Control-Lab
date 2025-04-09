import db from '../repository/database.js';
export const listUsers = async (req, res) => {
    const sql  = 'SELECT id, email, name, photo_profile, role FROM users';
    try {
        const [rows] = await db.query(sql);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).render('admin-list-users', { users: rows });
    } catch (error) {
        console.error('Error querying users:', error);
        return res.status(500).render('500',{ message: 'Internal server error' });
    }
}


export const upgradeUser = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const sql = 'UPDATE users SET role = ? WHERE id = ?';
    try {
        const [result] = await db.query(sql, [role, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.redirect('/admin/list-users?isAdmin=true');
    } catch (error) {
        console.error('Error upgrading user:', error);
        return res.status(500).render('500', { message: error.message });
    }
}