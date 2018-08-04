const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');

const url = 'mongodb://127.0.0.1:27017/mymoney2';
const dbName = 'mymoney2';

const client = (async function() {
    let client;
    client = await MongoClient.connect(url);
    console.log("Connected correctly to mongo server");

    return client;
})();

class Client {

}

client.db(dbName);
module.exports = client;

