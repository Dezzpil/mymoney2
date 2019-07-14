const assert = require('assert');
const util = require('util');
const InputParser = require('./Parser.js');

/**
 * @todo write documentation
 */
class Saver {

    constructor(parser) {
        assert(parser instanceof InputParser);
        this.parser = parser;
        this.results = [];
        this.errors = [];
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
            this.data['made_at'] = parseInt(Date.now() / 1000);
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
     * @param {String} user
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

        for (let i = 0; i < storages.length; i++) {
            const storage = storages[i];
            try {
                await storage.connect();
                const result = await storage.store(this.data, rawResult);
                this.results.push(result);
                storage.close();
            } catch (e) {
                this.errors.push(e);
                console.error(util.inspect(e, {showHidden: false, depth: null}));
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
