const request = require('request');
const tynt = require("tynt");
const checkAsset = require("../database/routes/asset").checkAsset;
let cassandra = require('cassandra-driver');

function absorberService() {
    const client = new cassandra.Client({
        contactPoints: ['127.0.0.1'],
        localDataCenter: 'datacenter1',
        keyspace: 'crypto'
    });
    client.connect(function (err, result) {
        if (!err) {
            console.log('cassandra connected');
            setInterval(function () {
                request({
                    url: "http://api.coincap.io/v2/assets",
                    method: "GET",
                    timeout: 10000,
                    followRedirect: true,
                    maxRedirects: 10
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log('request to api.coincap.io '.concat(tynt.Green('success!')));
                        if (response !== undefined) {
                            const data = JSON.parse(response.body);
                            if (data['data'] !== undefined) {
                                //let count = 0;
                                data['data'].forEach(function (value) {
                                    checkAsset(client, value);
                                });
                            }
                        }
                    } else {
                        if (response === undefined) {
                            console.log(tynt.Red("error: ") + " possible no network");
                        }
                        console.log(tynt.Red("error: ") + response);
                    }
                });
            }, 6000);
        } else {
            console.log('check_asset: error connecting to cassandra: '.concat(result));
            callback(undefined);
        }
    });
}

module.exports = {absorberService};
