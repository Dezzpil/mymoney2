const { exec } = require('child_process');
const util = require('util');
const assert = require('assert');

const execAwait = util.promisify(exec);

const MongoClient = require('mongodb').MongoClient;
const Storage = require('../Storage');

const defaultURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mymoney2';
const defaultDB = process.env.MONGO_DB || 'mymoney2';

/**
 *
 */
class Mongo extends Storage {

    static async getPeriodInSeconds(from, to, pair=false) {
        let result = await execAwait(`date --date='${from}' +%s`);
        console.log(`date --date='${from}' +%s`, result.stdout);
        const fromTimestamp = parseInt(result.stdout.replace('\n', ''));
        result = await execAwait(`date --date='${to}' +%s`);
        console.log(`date --date='${to}' +%s`, result.stdout);
        const toTimestamp = parseInt(result.stdout.replace('\n', ''));
        const delta = fromTimestamp - toTimestamp;
        if (pair) {
            return [fromTimestamp, toTimestamp];
        }
        return delta;
    }

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
        this.client = new MongoClient(this.URI, { useNewUrlParser: true });
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log(`Client connected? ${this.client.isConnected()}`);
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

    /**
     *
     * @param {number} timestampFrom
     * @param {number} timestampTill
     * @return {Promise<void>}
     */
    async sum(timestampFrom, timestampTill) {
        let sum = 0;
        const col = this.db.collection('purchases');
        // {$and: [{made_at: {$gte: 'timestampFrom'}}, {made_at: {$lte: 'timestampTill'}}]}
        const result = await col.find(
            {$and: [{made_at: {$gte: timestampFrom}}, {made_at: {$lte: timestampTill}}]}
        ).toArray();
        console.log(`Mongo sum for period ${timestampFrom} ${timestampTill}`);
        result.forEach((doc) => {
            sum += parseInt(doc.value);
        });
        return sum;
    }

    async close() {
        if (this.client !== undefined) {
            return this.client.close();
        }
    }

}

module.exports = Mongo;


if (require.main == module) {

    (async () => {
        const data = [
            ['+1 hour', 'now', 3600],
            ['-1 hour', 'now', -3600],
            ['-1 week', 'now', -604800]
        ];

        data.forEach(async (item) => {
            console.warn(`Run test for Mongo.getPeriodInSeconds with ${item}`);
            const r = await Mongo.getPeriodInSeconds(item[0], item[1]);
            console.log(item, r);
            try {
                assert.equal(r, item[2]);
            } catch (e) {
                console.error(util.inspect(e));
                process.exit(1);
            }
        });

        const mongo = new Mongo();
        await mongo.connect();

        const result = await mongo.db.collection('purchases').deleteMany({details: 'test'});
        console.log(`Delete test rows ${result}`);

        const items = [
            {value: 100, details: 'test', period: '-1 hour'},
            {value: 100, details: 'test', period: '-2 hour'},
            {value: 100, details: 'test', period: '-3 hour'},
            {value: 100, details: 'test', period: '-4 hour'},
            {value: 100, details: 'test', period: '-5 hour'},
        ];

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            console.warn(`Run test for Mongo.store with ${item}`);
            const period = await Mongo.getPeriodInSeconds(item.period, 'now', true);
            item.made_at = period[0];
            const result = await mongo.store(item);
            console.log(util.inspect(item));
            try {
                assert(result);
            } catch (e) {
                console.error(util.inspect(e));
                process.exit(1);
            }
        }

        const sumsData = [
            ['-1 hour', 100],
            ['-2 hour', 200],
            ['-3 hour', 300],
            ['-4 hour', 400],
            ['-5 hour', 500],
        ];
        for (let i = 0; i < sumsData.length; i++) {
            let data = sumsData[i];
            console.warn(`Run test for Mongo.sum with ${data}`);
            const period = await Mongo.getPeriodInSeconds( data[0], 'now', true);
            const sum = await mongo.sum(period[0], period[1]);
            console.log(period, sum);
            try {
                assert.equal(data[1], `sum is ${sum}`);
            } catch (e) {
                console.error(util.inspect(e));
                process.exit(1);
            }
        }

        mongo.close();
        console.log('OK');
        process.exit();
    })();
}
