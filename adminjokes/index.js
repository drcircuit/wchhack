const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const path = require('path');
const client = require('./cookie-client')();
const { dadJokes } = require('./dad-jokes');
const puppeteer = require('puppeteer');
const app = express();
const adminCookieName = 'secret';
const adminCookieValue = '${#IEatCookies4Breakfast!}';

app.disable('query parser')

const port = 3000;
let adminSessionID = null;
const adminToken = 'super-ckret-session-id-42-42-42-plz-dont-exploit-this-and-ruin-the-experience-for-all-the-others';

function parse(url) {
    let parts = url.split("?");
    let qs = {};
    if (parts.length > 1) {
        keypairs = parts[1].split("&");
        keypairs.forEach(kp => {
            let kvp = kp.split("=");
            qs[kvp[0]] = kvp[1];
        });
    }
    return qs;
}

const getRandomJoke = () => {
    const randomIndex = Math.floor(Math.random() * dadJokes.length);
    return dadJokes[randomIndex];
};

const store = new MemoryStore({
    checkPeriod: 240000, // Prune expired entries every 4 minutes
});
app.use(
    express.static(path.join(__dirname, 'public')) // Serve static content from the "public" folder
);

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        store: store,
    })
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/post-message', (req, res) => {
    req.query = parse(req.url);
    let { message, username, token } = req.query;
    if (username === 'admin' && token === adminToken) {
        adminSessionID = req.sessionID;
    } else {
        console.log(req.sessionID);
    }
    if (req.session.username === undefined && username !== 'admin') {
        username = generateRandomUsername();
        req.session.username = username;
    }
    let sanitizedMessage = (decodeURIComponent(message)).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    sanitizedMessage = decodeURIComponent(sanitizedMessage);
    sanitizedMessage = sanitizedMessage.replace("document.location","no-location-exploit-plz");
    sanitizedMessage = sanitizedMessage.replace("window.location","no-location-exploit-plz");
    console.log('Message:', sanitizedMessage, 'Username:', username);
    if (message && username) {
        const newMessage = {
            text: sanitizedMessage,
            username: username,
            timestamp: new Date().toLocaleString(),
        };
        if (!req.session.messages) {
            req.session.messages = [];
        }
        req.session.messages.push(newMessage);
    }
    res.redirect('/message-wall');
});

app.get('/message-wall', (req, res) => {
    if (req.session.username === undefined) {
        req.session.username = generateRandomUsername();
    }
    if (req.sessionID === adminSessionID) {
        res.cookie(adminCookieName, adminCookieValue);
        req.session.username = 'admin';
    }
    req.session.messages = req.session.messages || [];
    getMessages(req.session.id, (err, userMessages) => {
        if (err || !userMessages) {
            userMessages = [];
            console.log(err);
        }
        res.render('message-wall', { messages: userMessages, username: req.session.username });
    });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
function getMessages(sessionId, cb) {
    if (sessionId === adminSessionID) {
        store.all((err, sessions) => {
            const messages = [];
            if (err) {
                console.error('Error getting messages:', err);
            }
            for (sess in sessions) {
                if (sessions.hasOwnProperty(sess)) {
                    if(sessions[sess].messages)
                        messages.push(...sessions[sess].messages);
                }
            }
            cb(err, messages);
        });
    } else {
        store.get(sessionId, (err, session) => {
            if (!session) return cb(err, []);
            const userMessages = session.messages;
            if (err) {
                console.error('Error getting messages:', err);
            }
            store.get(adminSessionID, (err, session) => {
                if (!session) return cb(err, userMessages);
                const adminMessages = session.messages;
                cb(err, userMessages.concat(adminMessages));
            });

        });
    }

}

// Create a shared browser instance
let browser;

async function initializeBrowser() {
    browser = await puppeteer.launch(
        {
            headless: true,
            args: ['--no-sandbox']
         }
    );
}

async function closeBrowser() {
    await browser.close();
}

async function bot2() {
    const randomJoke = getRandomJoke();
    const adminToken = 'super-ckret-session-id-42-42-42-plz-dont-exploit-this-and-ruin-the-experience-for-all-the-others';

    const page = await browser.newPage();
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept();
    });
    // Navigate to the post-message endpoint
    await page.goto(`http://localhost:${port}/post-message?message=${encodeURIComponent(randomJoke)}&username=admin&token=${adminToken}`);

    // Wait for any JavaScript to execute
    await page.waitForTimeout(1000);

    // Navigate to the message wall endpoint
    const redirectUrl = await page.evaluate(() => window.location.href);
    
    await page.goto(`${redirectUrl}?token=${adminToken}`);
    
    // Get the content of the message wall
    const messageWallContent = await page.content();

    console.log('Admin message wall:', messageWallContent);
}

const runBot = async () => {
    try {
        await bot2();
    } catch (error) {
        console.error('Error running bot:', error);
    }
};

// Initialize the browser instance
initializeBrowser()
    .then(() => {
        setInterval(runBot, 3000); // Run the bot every 30 seconds
    })
    .catch((error) => {
        console.error('Error initializing browser:', error);
    });

// Clean up the browser instance when the server is closed
process.on('exit', closeBrowser);
process.on('SIGINT', closeBrowser);
process.on('SIGTERM', closeBrowser);



const adjectives = [
    'Funny',
    'Silly',
    'Witty',
    'Clever',
    'Goofy',
    'Quirky',
    'Whimsical',
    'Cheeky',
    'Playful',
    'Zany',
    'Bizarre',
    'Absurd',
    'Hilarious',
    'Ridiculous',
    'Outrageous',
    'Offbeat',
    'Wacky',
    'Peculiar',
    'Kooky',
    'Amusing',
    'Laughable',
    'Entertaining',
    'Comical',
    'Humorous',
    'Far-out',
    'Hysterical',
    'Wild',
    'Madcap'
];

const cartoonCharacters = [
    'Mickey Mouse',
    'Bugs Bunny',
    'SpongeBob SquarePants',
    'Homer Simpson',
    'Bart Simpson',
    'Garfield',
    'Scooby-Doo',
    'Tom and Jerry',
    'Popeye',
    'Charlie Brown',
    'Snoopy',
    'Daffy Duck',
    'Donald Duck',
    'Goofy',
    'Fred Flintstone',
    'Betty Boop',
    'Pikachu',
    'Minnie Mouse',
    'Hello Kitty',
    'Dora the Explorer'
];

const dcSuperheroes = [
    'Superman',
    'Batman',
    'Wonder Woman',
    'The Flash',
    'Aquaman',
    'Green Lantern',
    'Cyborg',
    'Supergirl',
    'Batgirl',
    'Nightwing',
    'Robin',
    'Green Arrow',
    'Black Canary',
    'Martian Manhunter',
    'Hawkgirl',
    'Shazam'
];

const marvelSuperheroes = [
    'Spider-Man',
    'Iron Man',
    'Captain America',
    'Hulk',
    'Thor',
    'Black Widow',
    'Hawkeye',
    'Black Panther',
    'Doctor Strange',
    'Captain Marvel',
    'Wolverine',
    'Storm',
    'Cyclops',
    'Jean Grey',
    'Gambit',
    'Deadpool'
];

const chessMasters = [
    'Garry Kasparov',
    'Magnus Carlsen',
    'Viswanathan Anand',
    'Bobby Fischer',
    'Mikhail Tal',
    'Anatoly Karpov',
    'Vladimir Kramnik',
    'Veselin Topalov',
    'Viktor Korchnoi',
    'Levon Aronian'
];

const movieStars = [
    'Tom Hanks',
    'Leonardo DiCaprio',
    'Meryl Streep',
    'Robert De Niro',
    'Denzel Washington',
    'Johnny Depp',
    'Brad Pitt',
    'Angelina Jolie',
    'Scarlett Johansson',
    'Jennifer Lawrence'
];

const characterArray = [
    ...cartoonCharacters,
    ...dcSuperheroes,
    ...marvelSuperheroes,
    ...chessMasters,
    ...movieStars
];
// Generate a random username
function generateRandomUsername() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const character = characterArray[Math.floor(Math.random() * characterArray.length)];
    return `${adjective} ${character}`;
}