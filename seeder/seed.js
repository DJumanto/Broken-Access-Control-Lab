import db from '../repository/database.js';
import bcrypt from 'bcrypt';

const users = 
[
    [
        "daffainfo@infokan.com",
        await bcrypt.hash("Aduh Gantengya", 10),
        "Muhammad Daffa",
        "admin",
        "/img/TXVoYW1tYWQgRGFmZmE=.jpeg"
    ],
    [
        "DJumanto@infobojo.com",
        await bcrypt.hash("Bisa dipercepat nggak >:(", 10),
        "DJumanto",
        "co-admin",
        "/img/REp1bWFudG8=.jpeg"
    ],
    [
        "Fay@infogolok.com",
        await bcrypt.hash("GedaGediGedaGedaO", 10),
        "Fay",
        "user",
        "/img/RmF5.jpeg"
    ],
    [
        "Wiwiwiwi@uwuwuw.com",
        await bcrypt.hash("Ganteng", 10),
        "wiwiwcat",
        "user",
        "/img/d2l3aXdjYXQ=.jpeg"
    ],
    [
        "emma@stream.com",
        await bcrypt.hash("SearchForEmma", 10),
        "Emma",
        "user",
        "/img/ZW1tYQ==.jpeg"
    ],
    [
        "Ayase@basket.com",
        await bcrypt.hash("SiAyase", 10),
        "Ayase",
        "user",
        "/img/QXlhc2U=.jpeg"
    ],
    [
        "Noa@Junis.com",
        await bcrypt.hash("NoaUltramanJagoWok", 10),
        "Noa",
        "user",
        "Tm9h.jpeg"
    ]
]

const seed = async () => {
    try {
        await db.execute('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email varchar(255) NOT NULL, password varchar(255) NOT NULL, name varchar(255) NOT NULL, role varchar(255) NOT NULL, photoProfile varchar(255), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)');
        console.log('Table users created or already exists.');
        for (const user of users) {
            await db.execute('INSERT INTO users (email, password, name, role, photoProfile) VALUES (?, ?, ?, ?, ?)', user);
        }
        console.log('Users seeded successfully!');
        console.log('Testing the existing data');
        const [rows] = await db.execute('SELECT name FROM users');
        for (const row of rows) {
            console.log(row.name);
        }
        console.log('Data testing complete!');
        console.log('Seeding complete!');
        
    }catch (error) {
        console.error('Error seeding database:', error);
    }
}

export default seed;