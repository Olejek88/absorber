const request = require('request');
const tynt = require("tynt");
const checkAsset = require("../database/routes/asset").checkAsset;
const connectCassandra = require("../database/routes/index").connectCassandra;

function absorberService() {
    let client = undefined;
    setInterval(function(){
        request({
            url: "http://api.coincap.io/v2/assets",
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        },function(error, response, body){
            connectCassandra(function(ret) {
                    client = ret;
                }
            );
            if(!error && response.statusCode === 200){
                console.log(tynt.Green('success!'));
                if (response !== undefined) {
                    const data = JSON.parse(response.body);
                    if (data['data'] !== undefined && client !== undefined) {
                        data['data'].forEach(function (value) {
                            //console.log(value);
                            checkAsset(client,value);
                        });
                    }
                }
            }else{
                if (response === undefined) {
                    console.log(tynt.Red("error: ")+" possible no network");
                }
                console.log(tynt.Red("error: ")+response);
            }
        });
    }, 6000);
}

module.exports = {absorberService};
