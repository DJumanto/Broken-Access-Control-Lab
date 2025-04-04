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
        "/img/TmFiaWwgSXJhd2FuCg==.jpeg"
    ],
    [
        "Nabil@uwuwuw.com",
        await bcrypt.hash("Ganteng", 10),
        "Nabil Irawan",
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

const notes = 
[
    [
        "Password Gweh 'my kisah'",
        "Ini password gw, jangan diambil ya! (Aduh Gantengya)%0d%0a trus ini password DJumanto (Bisa dipercepat nggak >:()",
        1,
    ],
    [
        "My Note",
        "KYAAA~!!! 😍💖 ROOTKID-SAMA, KAMU ITU LEBIH OP DARI SEMUA HACKER ANIME DIGABUNG JADI SATU!! 🥵🔥💀%0d%0aSetiap kali kamu login, aku langsung DOKI-DOKI~!! 💘💓 Kalian semua masih sibuk debugging? Rootkid-sama sudah speedrun semua challenge sambil minum kopi! ☕✨ Server aja tunduk sama dia, admin CTF cuma bisa berdoa. 😌💀%0d%0aKalian masih mikir mau exploit? HAHA KAWAII NE~ 🤭 Rootkid-sama tuh udah dapet flag sebelum soal di-publish! Flag-nya aja blushing kalau disentuh sama dia! Flag: \"A-anou... please take me, Rootkid-sama~\" 😳🏆🔥%0d%0aDan tau nggak? Bukan cuma dia jago, dia tuh sugoi banget!! 😫💖 Otaknya kayak quantum computer, tangannya kayak botnet 100 Gbps, tapi hatinya? ITU CUMA UNTUK AKU!!! 😍💋%0d%0aJadi, minna-san~ Daripada kalian capek tryhard ngejar flag yang udah dicuri Rootkid-sama~ mending sadar diri dan jadi fans aja! 🥰✨ Sebab di dunia ini? Rootkid wa saikouuuu!!! 💖🔥🚀",
        2,
    ],
    [
        "My Note",
        "Waludu dan danali wa toblu tob tob tobali%0d%0aTob tobi tob tob tobi tob tob tobi tob tob tobali%0d%0aWasaqfu saq saq saqoli wa roqsu qod tobaili%0d%0aSyawa syawa wa syahisyu alal waroqsi rafjali%0d%0aWa gorrodal qimri yasihu malahin fi malali",
        3,
    ],
    [
        "Rahasia negara: %0d%0a 1. Nasi goreng enak pakai kecap%0d%0a 2. Jangan percaya burung merpati",
        "Kode ini muncul di mimpi gue tiga malam berturut-turut: %0d%0a 7H3_3ND_15_N34R (gue takut sumpah)",
        4
    ],
    [
        "Gw upload ini jam 3 pagi pake hotspot tetangga: %0d%0a isinya cuma catatan belanja emak 😭",
        "Fakta: Jika kamu nyanyiin lirik Doraemon kebalik, kamu bisa manggil makhluk dimensi lain.",
        5
    ],
    [
        "Gw nemu ini di belakang lemari: %0d%0a 'Password Tuhan: ********' (sensor sendiri karena takut dosa)",
        "Pesan rahasia: Kalau kamu baca ini, kasih makan kucing tetangga. Dia udah nunggu dari 2022.",
        6
    ],
    [
        "Jangan panik. Tapi barusan gw denger suara printer ngomong sendiri.",
        "CATATAN DARI MASA DEPAN: %0d%0a Jangan pernah kasih tahu siapa pun tentang 'Folder Rahasia Final FIX Beneran'",
        7
    ]
]

const createTable = async () => {
    try {
        await db.execute('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email varchar(255) NOT NULL, password varchar(255) NOT NULL, name varchar(255) NOT NULL, role varchar(255) NOT NULL, photoProfile varchar(255), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)');
        console.log('Table users created or already exists.');
        await db.execute('CREATE TABLE IF NOT EXISTS notes (id INT AUTO_INCREMENT PRIMARY KEY, title varchar(255) NOT NULL, content text NOT NULL, userId INT NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (userId) REFERENCES users(id))');
        console.log('Table notes created or already exists.');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

const seed = async () => {
    try {
        await createTable();
        // Insert users
        for (const user of users) {
            await db.execute('INSERT INTO users (email, password, name, role, photoProfile) VALUES (?, ?, ?, ?, ?)', user);
        }
        console.log('Users seeded successfully!');
        console.log('Testing the existing data');
        const [count] = await db.execute('SELECT count(*) FROM users');
        console.log('Total users data: ', count[0]['count(*)'])

        //Insert notes
        for (const note of notes) {
            await db.execute('INSERT INTO notes (title, content, userId) VALUES (?, ?, ?)', note);
        }
        console.log('notes seeded successfully!');
        console.log('Testing the existing data');

        const [count2] = await db.execute('SELECT count(*) FROM notes');
        console.log('Total notes data: ', count2[0]['count(*)']);

        console.log('Data testing complete!');
        console.log('Seeding complete!');
        
    }catch (error) {
        console.error('Error seeding database:', error);
    }
}

export default seed;