
class Storage {

    constructor(options) {}

    async connect() {}

    /**
     *
     * @param target
     * @param data
     * @param raw
     * @return {Promise<void>}
     */
    async store(target, data, raw = false) {
        // TODO remove target arg
    }

    async close() {}

}

module.exports = Storage;
