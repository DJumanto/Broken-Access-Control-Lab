import express from 'express';
import route from './route.js';
import path from 'path';
import db from './repository/database.js';
import { fileURLToPath } from 'url';
import seed from './seeder/seed.js';
import nunjucks from 'nunjucks';

const app = express();
const PORT = process.env.PORT || 42690;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
nunjucks.configure('templates', {
    autoescape: true,
    express: app,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'njk');
app.use(route);
app.use((req, res, next) => {
    res.status(404).render('404', { url: req.originalUrl });
});

(async () => {
    try{
        console.log('Seeding database...');
        await seed();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error seeding database:', error);
    }
})();
