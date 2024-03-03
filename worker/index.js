
const { createClient } = require('redis');

const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || 'localhost';

const redisClient = createClient({
    url: `redis://${redisHost}:${redisPort}`,
    pingInterval: 5000
});

redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

const sub = redisClient.duplicate();

function fib(idx) {
    if (idx < 2) return 1;
    return fib(idx - 1) + fib(idx - 2);
}

sub.on('message', (channel, message) => {
    redisClient.hSet('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');