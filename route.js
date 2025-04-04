import express from 'express';
const route = express.Router();

//Broken Access Control Lab Routes
/**
 * vertical privilege escalation
 * /admin should not be accessible to normal users yet it is
 * /admin/upgrade-user should not be accessible to normal users yet it is with parameter admin is true in base64
 * /signup should not be accessible, yet user can become admin by adding role in signup request
 * /me accessible, yet /api/user/?id is arbitrary and can be accessed by other users
 * /static access other user images
 * /user/note/?id is accessible by other users
 * user can create note for other users
 */

route.get('/admin')
route.get('/admin/list-users')
route.get('/admin/upgrade-user')
route.get('/api/admin/list-users')
route.post('/api/admin/upgrade-user')
route.get('/api/user/:id')
route.get('/me')
route.get('/me/note')
route.get('/api/note/:id')
route.post('/api/note')
route.get('/')
route.post('/api/signup')
route.post('/api/signin')

module.exports = route;