export const checkAdminParam = (req, res, next) => {
    if (!req.headers['cookie']) {
        return res.status(401).json({ message: 'Unauthorized, kamu siapa?' });
    }
    const rawCookie = req.headers['cookie']?.split('; ').find(row => row.startsWith('user_data='));
    if (!rawCookie) {
        return res.status(401).render('401', { message: 'Unauthorized, kamu siapa?' });
    }
    
    const userDataBase64 = rawCookie.split('=')[1];
    const userDataJson = Buffer.from(decodeURIComponent(userDataBase64), 'base64').toString('utf-8');
    const userData = JSON.parse(userDataJson);
    if (!userData || !userData.id) {
        return res.status(401).json({ message: 'Unauthorized, kamu siapa?' });
    }
    if (userData.role === 'admin') {
        return next();
    }
    if (req.query.isAdmin === undefined || !req.query.isAdmin) {
        return res.status(403).render('403', { message: 'param isAdmin is not True, access forbidden' });
    }
    if (req.query.isAdmin !== 'true') {
        return res.status(403).render('403',{ message: 'param isAdmin is not True, access forbidden' });
    }
    if (req.query.isAdmin === 'true') {
        return next();
    }
}