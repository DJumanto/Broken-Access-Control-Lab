import bcrypt from 'bcrypt';
import db from '../repository/database.js';
import fs from 'fs';
import { serialize } from 'cookie';
import { upload } from '../middlewares/upload.js';
import path from 'path';

export const login = async (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try{
        const [rows] = await db.query(sql, [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            photo_profile: user.photo_profile,
        };


        const cookie = serialize('user_data', Buffer.from(JSON.stringify(userData)).toString('base64'), {
            httpOnly: true,
            sameSite: 'Strict',
            path: '/',
            maxAge: 60 * 60 * 24,
        });
        console.log('user login: ', userData.name);
        res.setHeader('Set-Cookie', cookie);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Location', `/user/${user.id}`);
        res.status(302).json({
            message: 'Login successful',
            userId: 'current user id:'+ user.id,
            redirect: 'redirecting to /me'
        });
    }catch (error) {
        console.error('Error querying user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const signUp = async (req, res) => {

    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
      const { email, password, name, role = 'user' } = req.body;
  
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required' });
      }
  
      const [user] = await connection.query('SELECT * FROM users WHERE email = ? OR name = ?', [email, name]);
      if (user.length > 0) {
        return res.status(400).json({ message: 'Email or name already exists' });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a profile picture' });
      }
  
      const extension = path.extname(req.file.originalname);
      const filename = Buffer.from(name).toString('base64') + extension;
      const newPath = path.join('public/img/', filename);
  
      fs.renameSync(req.file.path, newPath);
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const photoProfilePath = '/img/' + filename;
  
      const sql = 'INSERT INTO users (email, password, name, role, photo_profile) VALUES (?, ?, ?, ?, ?)';
      const values = [email, hashedPassword, name, role, photoProfilePath];
  
      const [result] = await connection.query(sql, values);
  
      await connection.commit();
      connection.release();
      console.log('User registered successfully: userid-', result.insertId);
      return res.render('login')
  
    } catch (err) {
      console.error('Error:', err);
      if (connection) await connection.rollback();
  
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
  
      return res.status(500).json({ message: 'Internal server error' });
    }
  };