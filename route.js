import express from 'express';
import {signUp, login} from './controllers/authController.js';
import { me } from './controllers/userController.js';
import { listUsers, upgradeUser } from './controllers/adminController.js';
import { getAllNotesByUserID, getNoteByID, createNote } from './controllers/noteController.js';
import { upload } from './middlewares/upload.js';
import { checkIsLogin } from './middlewares/checkIsLogin.js';
import { checkisAdmin } from './middlewares/checkIsAdmin.js';
import { checkAdminParam } from './middlewares/checkAdminParam.js';
const route = express.Router();

route.get('/', (req, res) => {
    res.render('welcome')
});
route.get('/login', (req, res) => {
    res.render('login')
});
route.get('/register', (req, res) => {
    res.render('signup')
});
route.get('/admin', checkisAdmin, (req, res) => {
    res.render('admin')
});
route.get('/admin/list-users', checkAdminParam, listUsers);

route.post('/api/admin/upgrade-user/:id', checkAdminParam, upgradeUser);

route.get('/logout', (req, res) => {
    res.clearCookie('user_data');
    res.redirect('/login');
});
route.get('/user/:id', checkIsLogin ,me);
route.get('/user/:id/note', checkIsLogin , getAllNotesByUserID);
route.get('/user/:id/create-note', checkIsLogin ,(req, res) => {
    const { id } = req.params
    res.status(200).render('user-note-create', { id: id });
});
route.post('/user/:id/create-note', checkIsLogin, createNote);
route.get('/note/:id', checkIsLogin ,getNoteByID);
route.post('/api/signup', upload.single('photoProfile'),signUp);
route.post('/api/login',login);
route.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /admin\nDisallow: /admin/list-users\n');
});
export default route;