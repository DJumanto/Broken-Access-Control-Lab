import db from '../repository/database.js'


export const me = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    const sql = 'SELECT * FROM users WHERE id = ?';
    try {
        const [rows] = await db.query(sql, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = rows[0];
        res.render('me', { user });
    } catch (error) {
        console.error('Error querying user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}