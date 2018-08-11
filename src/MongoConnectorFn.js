const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const defaultUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mymoney2';
const defaultDBName = process.env.MONGO_DB || 'mymoney2';

/**
 *
 */
class MongoConnectorFn {

    constructor(url = defaultUrl) {
        this.url = url;
    }

    /**
     * @param {Function} fn
     * @param {String} dbName
     * @returns {Promise<Db>}
     * @throws Error
     */
    connect(fn, dbName = defaultDBName) {
        if (!this.client || !this.client.isConnected()) {
            this.client = MongoClient.connect(
                this.url,
                {useNewUrlParser: true},
                function(err, client) {
                    assert.strictEqual(null, err);
                    fn(client.db(dbName));
                }
            );
        }
    }

    /**
     *
     * @returns {Promise}
     */
    close() {
        if (this.client !== undefined) {
            return this.client.close();
        }
    }

}

module.exports = MongoConnectorFn;