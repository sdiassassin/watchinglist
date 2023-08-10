let config = {
    mode: 'local',
    port: 3000,

    mongo: {
        host: '127.0.0.1',
        port: 27017,
        dbname: 'watch_db',
    },

    info:{
        site_name:"Watch Listing",
        domain:"127.0.0.1",
    },
    expTime : 30 * 24 * 60 * 60,

    brands:['Rolex','Cartier','Chopard'],
    case_sizes:['38','39','40','41','42']

};

module.exports = function () {
    return config;
};
