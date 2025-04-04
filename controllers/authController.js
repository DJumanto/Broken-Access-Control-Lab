import bcrypt from 'bcrypt';
import db from '../repository/database.js';
import fs from 'fs';
import { serialize } from 'cookie';

export const signIn = async (req, res) => {
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

        res.setHeader('Set-Cookie', cookie);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Location', '/me');
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
    const { email, password, name, role = user } = req.body;
    const user = await db.query('SELECT * FROM users WHERE email = ? OR name = ?', [email, name]);
    if (user[0].length > 0) {
        return res.status(400).json({ message: 'Email or name already exists' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a profile picture' });
    }
    let photoProfile = req.file ? req.file.path : null;
    let extension = photoProfile ? photoProfile.split('.').pop() : null;
    let filename = btoa(name) + '.' + extension;
    let newPath = 'public/img/' + filename;
    fs.rename(photoProfile, newPath, (err) => {
        if (err) {
            console.error('Error renaming file:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    const path = '/img/' + filename;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (email, password, name, role, photo_profile) VALUES (?, ?, ?, ?, ?)';
    const values = [email, hashedPassword, name, role, path];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
}