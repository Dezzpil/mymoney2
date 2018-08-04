const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const defaultUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mymoney2';
const defaultDBName = process.env.MONGO_DB || 'mymoney2';

/**
 *
 */
class MongoConnector {

    constructor(url = defaultUrl) {
        this.url = url;
    }

    /**
     *
     * @param dbName
     * @returns {Promise<Db>}
     * @throws Error
     */
    async connect(dbName = defaultDBName) {
        if (!this.client || !this.client.isConnected()) {
            this.client = await MongoClient.connect(this.url, {useNewUrlParser: true});
        }
        return this.client.db(defaultDBName);
    }

    /**
     *
     * @returns {Promise}
     */
    async close() {
        if (this.client !== undefined) {
            return this.client.close();
        }
    }

}

module.exports = MongoConnector;