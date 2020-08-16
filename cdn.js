const axios = require('axios');
const ping = require('ping');
const { CDN_SERVERS, CDN_ORG } = require('./constants/constants');

exports.select = async () => {
    // Send ping to all servers
    const serversData = await getDataFromServers(CDN_SERVERS);

    // Get the alive servers
    const aliveServers = serversData.filter(({ alive }) => alive);

    // Sort by time
    aliveServers.sort((serverA, serverB) => serverA.time > serverB.time ? 1 : -1);

    const sortCdnServers = aliveServers.map(server => server.host);

    return content => fetchDataFromServers(content, sortCdnServers, CDN_ORG);
}

async function fetchDataFromServers(content, cdnServers, originCdn) {
    // Fetch data
    let status;
    let result;
    let serverIndex = 0;

    while (status !== 200 && serverIndex < cdnServers.length) {
        try {
            result = await axios.get(`http://${cdnServers[serverIndex]}${content}`);
            status = result.status;
        } catch (e) {
            serverIndex++;
        }
    }

    if (!status) {
        result = await axios.get(`http://${originCdn}${content}`);
    }

    return result;
}

async function getDataFromServers(CDN_SERVERS) {
    return await Promise.all(CDN_SERVERS.map(server => {
        return ping.promise.probe(server);
    }));
}