module.exports = {
    fields:{
        uuid: "uuid",
        asset: "uuid",
        price: "float",
        created: "timestamp"
    },
    key: ["asset", "created"],
    clustering_order: {"created": "desc"}
};
