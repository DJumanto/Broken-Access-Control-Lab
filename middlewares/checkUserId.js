export const checkUserId = (req, res, next) => {
    if(!req.headers['cookie']){
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
    req.userId = userData.id;
    
    next();
}