const assert = require('assert');
const InputParser = require('./Parser.js');

/**
 * @todo write documentation
 */
class Saver {

    constructor(parser) {
        assert(parser instanceof InputParser);
        this.parser = parser;
    }

    /**
     *
     * @param {String} string
     * @return {Saver}
     * @throws Error
     */
    setInput(string) {
        try {
            this.data = this.parser.parse(string);
            this.data['made_at'] = Date.now();
        } catch (e) {
            throw e;
        }
        return this;
    }

    /**
     *
     * @param {String} timestamp
     * @return {Saver}
     */
    setDate(timestamp) {
        this.data['made_at'] = timestamp;
        return this;
    }

    /**
     *
     * @param {mixed} user
     * @return {Saver}
     */
    setUser(user) {
        this.data['user'] = user;
        return this;
    }

    /**
     * @param {Array} storages
     * @param {Boolean} rawResult Use raw result from storage driver
     * @return {Promise}
     */
    async save(storages, rawResult = false) {
        if (!('value' in this.data)) {
            throw new Error('Данные покупки не заданы');
        }

        this.results = [];
        this.errors = [];
        for (let i = 0; i < storages.length; i++) {
            const storage = storages[i];
            try {
                const target = await storage.connect();
                const result = await storage.store(target, this.data, rawResult);
                this.results.push(result);
                storage.close();
            } catch (e) {
                this.errors.push(e);
            }
        }

        if (this.errors.length === storages.length) {
            throw new Error('Данные не удалось сохранить ни в одно из хранилищ');
        }

        return this;
    }

    getErrors() {
        return this.errors;
    }

    getResults() {
        return this.results;
    }
}

module.exports = Saver;