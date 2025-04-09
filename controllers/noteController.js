import db from '../repository/database.js';

export const getNoteByID = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM notes WHERE id = ?';
    try {
        const [rows] = await db.query(sql, [id]);
        if (rows.length === 0) {
            return res.status(404).render('404', { message: 'Note not found' });
        }
        res.status(200).render('user-note-detail', { note: rows[0] });
    } catch (error) {
        console.error('Error querying note:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllNotesByUserID = async (req, res) => {
    const { id } = req.params;
    let sql = 'SELECT id,title,content FROM notes WHERE userId = ?';
    try {
        const [rows] = await db.query(sql, [id]);
        sql  = 'SELECT name FROM users where id = ?';
        const [name] = await db.query(sql, [id]);
        console.log('name: ', name[0].name);
        res.status(200).render('user-notes', { notes: rows, name: name[0].name });
    } catch (error) {
        console.error('Error querying notes:', error);
        return res.status(500).render('500', { message: 'Internal server error' });
    }
}

export const createNote = async (req, res) => {
    const { title, content} = req.body;
    const { id } = req.params;
    const sql = 'INSERT INTO notes (title, content, userId) VALUES (?, ?, ?)';
    try {
        const [result] = await db.query(sql, [title, content, id]);
        res.status(201).redirect(`/user/${id}/note`);
    } catch (error) {
        console.error('Error creating note:', error);
        return res.status(500).render('500', { message: 'Internal server error' });
    }
}

export const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ? AND userId = ?';
    try {
        const [result] = await db.query(sql, [title, content, id, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).render('404', { message: 'Note not found or you do not have permission to update this note' });
        }
        res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error('Error updating note:', error);
        return res.status(500).render('500',{ message: 'Internal server error' });
    }
}

export const deleteNote = async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM notes WHERE id = ?';
    try {
        const [result] = await db.query(sql, [id, req.user.id]);
        if (result.affectedRows === 0) {
            return res.status(404).render('404',{ message: 'Note not found or you do not have permission to delete this note' });
        }
    }catch (error) {
        console.error('Error deleting note:', error);
        return res.status(500).render('500',{ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Note deleted successfully' });
};