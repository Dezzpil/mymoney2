const MongoClient = require('mongodb').MongoClient;
const Storage = require('../Storage');

const defaultURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mymoney2';
const defaultDB = process.env.MONGO_DB || 'mymoney2';

/**
 *
 */
class Mongo extends Storage {

    constructor(options) {
        super(options);
        this.URI = defaultURI;
        this.DB = defaultDB;
        if (typeof options === 'object') {
            if ('URI' in options) this.URI = options.URI;
            if ('DB' in options) this.DB = options.DB;
        }
        console.log(`Mongo URI '${this.URI}'`);
        console.log(`Mongo DB '${this.DB}'`);
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.client = MongoClient.connect(
                this.URI,
                { useNewUrlParser: true },
                (err, client) => {
                    if (err) reject(err);
                    resolve(client.db(this.DB));
                }
            );
        });
    }

    async store(target, data, raw = false) {
        const db = target;
        let col = db.collection('purchases');
        return new Promise((resolve, reject) => {
            col.insertOne(data, function (err, result) {
                if (err) reject(err);
                if (raw) resolve(result);
                resolve(result.insertedId);
            });
        });
    }

    async close() {
        if (this.client !== undefined) {
            return this.client.close();
        }
    }

}

module.exports = Mongo;
