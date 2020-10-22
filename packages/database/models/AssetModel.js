module.exports = {
    fields:{
        id     : "uuid",
        name    : "text",
        symbol    : "text",
        supply: "float",
        priceUsd: "float",
        changePercent24Hr : "float",
        created : "timestamp"
    },
    key:["name","symbol"]
};
