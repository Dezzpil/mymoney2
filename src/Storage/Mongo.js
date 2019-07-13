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
        this.dbName = defaultDB;
        if (typeof options === 'object') {
            if ('URI' in options) this.URI = options.URI;
            if ('dbName' in options) this.dbName = options.dbName;
        }
        console.log(`Mongo URI '${this.URI}'`);
        console.log(`Mongo DB '${this.dbName}'`);

        this.db = null;
    }

    async connect() {
        this.client = new MongoClient(this.URI);
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
        } catch (e) {
            throw e;
        }
    }

    async store(data, raw = false) {
        const col = this.db.collection('purchases');

        try {
            const result = await col.insertOne(data);
            return raw ? result : result.insertedId;
        } catch (e) {
            throw e;
        }
    }

    async sum(timeModifier) {



        const col = this.db.collection('purchases');



        // col.find();
        // TODO
    }

    async close() {
        if (this.client !== undefined) {
            return this.client.close();
        }
    }

}

module.exports = Mongo;

if (require.main == module) {

}
