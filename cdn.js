const axios = require('axios');
const ip = require("ip");
const ping = require('ping');

const CDN_SERVERS = ["domain1.org", "domain2.org", "domain3.org"];
const CDN_ORG = "orgdomain.com";

exports.select = async () => {
    // Send ping to all servers
    const servers = await getDataFromServers(CDN_SERVERS);

    // Get the alive servers
    const aliveServers = servers.filter(({ alive }) => alive);

    // Sort by time
    aliveServers.sort(compareServer);

    printServersData(aliveServers);

    const sortCdnServers = aliveServers.map(server => server.host);

    return content => fetchDataFromServers(content, sortCdnServers, CDN_ORG);
}

async function fetchDataFromServers(content, cdnServers, originCdn) {
    // Fetch data
    const status = '';
    let serverIndex = 0;
    let result = '';

    while (status === 200 && serverIndex < CDN_SERVERS.length) {
        try {
            result = await axios.get(`http://${cdnServers[serverIndex]}${content}`);
            status = result.status;
        } catch (e) {
            serverIndex++;
        }
    }

    if (result === '') {
        result = await axios.get(`http://${originCdn}${content}`);
    }

    return result;
}

async function getDataFromServers(CDN_SERVERS) {
    return await Promise.all(CDN_SERVERS.map(server => {
        return ping.promise.probe(server);
    }));
}

function printServersData(servers) {
    servers.forEach(({ host, alive, time }) => console.log(host, alive, time));
}

function compareServer(serverA, serverB) {
    const timeA = serverA.time;
    const timeB = serverB.time;

    if (timeA > timeB) {
        return 1;
    } else if (timeA < timeB) {
        return -1;
    }

    return 1;
}