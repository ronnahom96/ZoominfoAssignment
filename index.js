const { select } = require('./cdn');

async function main() {
    const serve = await select();
    const result = await serve('/api/fetch-items');

    console.log(result);
}

main();
