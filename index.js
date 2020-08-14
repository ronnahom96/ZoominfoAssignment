const express = require('express');
const app = express();
const { select } = require('./cdn');
const port = 3000;
const axios = require('axios');

app.get('/', async (req, res) => {
    const serve = await select();
    await serve('/stat');
    res.send('home');
})

app.get('/users', (req, res) => {
    const serve = select();

    res.send('users');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// async function main() {
//     const serve = await select();
//     // await serve('/api/fetch-items');
// }

// main();
