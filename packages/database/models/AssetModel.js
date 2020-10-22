module.exports = {
    fields:{
        id     : "uuid",
        name    : "text",
        symbol    : "text",
        supply: "float",
        price: "float",
        change: "float",
        created : "timestamp"
    },
    key:["name","symbol"]
};
