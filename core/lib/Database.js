var IP = '23.23.204.60';
//var IP = 'localhost';

var Database = {
    MongoClient: require('mongodb').MongoClient,
    ObjectID: require('mongodb').ObjectID,
    mongo: null,
    mongoPricing: null,
    open: function (callback) {
        Database.MongoClient.connect('mongodb://' + IP + ':27017/' + MONGO_DB, { w: 1 }, function (err, db) {
            if (err) {
                console.log('Error occurred connecting to DB', MONGO_DB, err);
            } else {
                Database.mongo = db;
                Database.mongof = db;
                
                Database.MongoClient.connect('mongodb://' + IP + ':27017/' + MONGO_PRICING_DB, { w: 1 }, function (err, dbPricing) {
                    if (err) {
                        console.log('Error occurred connecting to DB', MONGO_PRICING_DB, err);
                    } else {
                        Database.mongoPricing = dbPricing;
                        callback();
                    }
                });
            }
        });
    }
}

module.exports = Database;