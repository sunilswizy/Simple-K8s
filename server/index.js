const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const pgUser = process.env.PG_USER || 'postgres';
const pgHost = process.env.PG_HOST || 'postgres';
const pgPort = process.env.PG_PORT || 5432;
const pgPassword = process.env.PG_PASSWORD || 'mysecretpassword';
const pgDatabase = process.env.PG_DATABASE || 'postgres';


const app = express();
app.use(cors());
app.use(express.json());

console.log({
    user: pgUser,
    host: pgHost,
    port: pgPort,
    password: pgPassword,
    database: pgDatabase
})

const pgClient = new Pool({
    user: pgUser,
    host: pgHost,
    port: pgPort,
    password: pgPassword,
    database: pgDatabase
});

const connectWithRetry = async (maxRetries = 5, interval = 3000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await pgClient.connect();
            console.log("Connected to PostgreSQL");
            break;
        } catch (err) {
            console.error(`Failed to connect to PostgreSQL on attempt ${i + 1}:`, err);
            if (i === maxRetries - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }
}

connectWithRetry()
    .then(() => {
        pgClient
            .query('CREATE TABLE IF NOT EXISTS values (number INT)')
            .catch(err => console.log(err));
    })
    .catch(err => {
        console.error('Failed to connect to PostgreSQL after retries:', err);
    });

pgClient.on('error', () => console.log('Lost PG connection'));


const redis = require('redis');
const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hGetAll('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if(parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    };

    redisClient.hSet('values', index, 0);
    redisPublisher.publish('insert', index);

    pgClient.query('INSERT INTO VALUES(number) VALUES($1)', [index]);

    res.send({ working: true });
});


app.listen(5000, err => {
    console.log('App listening on port 5000');
});


