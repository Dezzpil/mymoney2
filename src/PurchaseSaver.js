const InputParser = require('../src/InputParser.js');

/**
 * @todo write documentation
 */
class PurchaseSaver {

    /**
     *
     * @param {String} string
     * @return {PurchaseSaver}
     * @throws Error
     */
    setInput(string) {
        const parser = new InputParser();
        try {
            this.parsed = parser.parse(string);
            this.parsed['made_at'] = Date.now();
        } catch (e) {
            throw e;
        }
        return this;
    }

    /**
     *
     * @param {String} timestamp
     * @return {PurchaseSaver}
     */
    setDate(timestamp) {
        this.parsed['made_at'] = timestamp;
        return this;
    }

    /**
     * @param {MongoConnector} connector
     * @param {Function} complete
     * @throws Error
     */
    async save(connector, complete) {
        if (!('value' in this.parsed)) {
            throw new Error('Данные покупки не заданы');
        }

        let parsed = this.parsed;
        (async function() {
            try {
                let db = await connector.connect();
                let col = db.collection('purchases');
                let result = await col.insertOne(parsed);
                complete(parsed);
            } catch (e) {
                throw e;
            }
        })();
    }
}

module.exports = PurchaseSaver;