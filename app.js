import express from 'express';
// import route from './route';
import path from 'path';
import db from './repository/database.js';
import { fileURLToPath } from 'url';
import seed from './seeder/seed.js';

const app = express();
const PORT = process.env.PORT || 42690;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// Routes (uncomment if needed)
// app.use(route);
