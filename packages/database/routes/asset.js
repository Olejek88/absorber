const models = require("express-cassandra");
const tynt = require("tynt");

// check and add asset
function checkAsset(client, req) {
    client.connect(function (err, result) {
        if(!err) {
            console.log('name: '.concat(req.name));
            models.instance.Asset.findOne({name: req.name}, function(err, asset){
                if(err) {
                    console.log('error: '.concat(err));
                    return {msg: err, code: -1};
                }
                if (asset !== undefined) {
                    console.log('found '.concat(asset.name));
                    insertData(asset.uuid, asset.priceUsd);
                } else {
                    console.log('asset: '.concat(asset));
                    let ret = insertAsset(req);
                    if (ret.code===0) {
                        let ret = insertData(ret.data, asset.priceUsd);
                        if (ret.code === 0) {
                            console.log(req.name.concat(": ").concat(ret.priceUsd));
                        }
                    }
                }
            });
        } else {
            console.log('check_asset: error connecting to cassandra: '.concat(result));
        }
    });
}

// add asset
function insertAsset(req) {
    let uuid = models.uuid();
    let asset = new models.instance.Asset({
        id: uuid,
        name: req.name,
        symbol: req.symbol,
        supply: parseFloat(req.supply),
        priceUsd: parseFloat(req.priceUsd),
        changePercent24Hr: parseFloat(req.changePercent24Hr),
        created: Date.now()
    });
    asset.save(function(err){
        if(err) {
            console.log(tynt.Red('error').concat(' saving asset: ').err);
            return {msg: err, code: -1, data: undefined};
        }
        console.log('asset '.concat(req.name).concat(' saved'));
        return {msg: "", code: 0, data: uuid};
    });
}

// add data
function insertData(uuid, price) {
    let asset = new models.instance.Data({
        asset: uuid,
        priceUsd: price,
        created: Date.now()
    });
    asset.save(function(err){
        if(err) {
            console.log(tynt.Red('error').concat(' saving data: ').err);
            return {msg: err, code: -1, data: undefined};
        }
        return {msg: "", code: 0, data: undefined};
    });
}

module.exports = {checkAsset};
